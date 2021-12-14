/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DEFAULT_MAX_TABLE_QUERY_SIZE } from '../../../../../../common/constants';

import { HostsRequestOptions } from '../../../../../../common/search_strategy/security_solution';
import * as buildQuery from './query.all_hosts.dsl';
import { allHosts } from '.';
import {
  mockOptions,
  mockSearchStrategyResponse,
  formattedSearchStrategyResponse,
  mockDeps as defaultMockDeps,
} from './__mocks__';
import { get } from 'lodash/fp';

class IndexNotFoundException extends Error {
  meta: { body: { error: { type: string } } };

  constructor() {
    super();
    this.meta = { body: { error: { type: 'index_not_found_exception' } } };
  }
}

const mockDeps = (riskyHostsEnabled = true) => ({
  ...defaultMockDeps,
  spaceId: 'test-space',
  endpointContext: {
    ...defaultMockDeps.endpointContext,
    experimentalFeatures: {
      ...defaultMockDeps.endpointContext.experimentalFeatures,
      riskyHostsEnabled,
    },
  },
});

describe('allHosts search strategy', () => {
  const buildAllHostsQuery = jest.spyOn(buildQuery, 'buildHostsQuery');

  afterEach(() => {
    buildAllHostsQuery.mockClear();
  });

  describe('buildDsl', () => {
    test('should build dsl query', () => {
      allHosts.buildDsl(mockOptions);
      expect(buildAllHostsQuery).toHaveBeenCalledWith(mockOptions);
    });

    test('should throw error if query size is greater equal than DEFAULT_MAX_TABLE_QUERY_SIZE ', () => {
      const overSizeOptions = {
        ...mockOptions,
        pagination: {
          ...mockOptions.pagination,
          querySize: DEFAULT_MAX_TABLE_QUERY_SIZE,
        },
      } as HostsRequestOptions;

      expect(() => {
        allHosts.buildDsl(overSizeOptions);
      }).toThrowError(`No query size above ${DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    });
  });

  describe('parse', () => {
    test('should parse data correctly', async () => {
      const result = await allHosts.parse(mockOptions, mockSearchStrategyResponse, mockDeps(false));
      expect(result).toMatchObject(formattedSearchStrategyResponse);
    });

    test('should enhance data with risk score', async () => {
      const risk = 'TEST_RISK_SCORE';
      const hostName: string = get(
        'aggregations.host_data.buckets[0].key',
        mockSearchStrategyResponse.rawResponse
      );
      const mockedDeps = mockDeps();

      (mockedDeps.esClient.asCurrentUser.search as jest.Mock).mockResolvedValue({
        body: {
          hits: {
            hits: [
              {
                _source: {
                  risk,
                  host: {
                    name: hostName,
                  },
                },
              },
            ],
          },
        },
      });

      const result = await allHosts.parse(mockOptions, mockSearchStrategyResponse, mockedDeps);

      expect(result.edges[0].node.risk).toBe(risk);
    });

    test('should not enhance data when feature flag is disabled', async () => {
      const risk = 'TEST_RISK_SCORE';
      const hostName: string = get(
        'aggregations.host_data.buckets[0].key',
        mockSearchStrategyResponse.rawResponse
      );
      const mockedDeps = mockDeps(false);

      (mockedDeps.esClient.asCurrentUser.search as jest.Mock).mockResolvedValue({
        body: {
          hits: {
            hits: [
              {
                _source: {
                  risk,
                  host: {
                    name: hostName,
                  },
                },
              },
            ],
          },
        },
      });

      const result = await allHosts.parse(mockOptions, mockSearchStrategyResponse, mockedDeps);

      expect(result.edges[0].node.risk).toBeUndefined();
    });

    test("should not enhance data when index doesn't exist", async () => {
      const mockedDeps = mockDeps();
      (mockedDeps.esClient.asCurrentUser.search as jest.Mock).mockImplementation(() => {
        throw new IndexNotFoundException();
      });

      const result = await allHosts.parse(mockOptions, mockSearchStrategyResponse, mockedDeps);

      expect(result.edges[0].node.risk).toBeUndefined();
    });
  });
});
