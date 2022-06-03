/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { CASE_LIST_CACHE_KEY, DEFAULT_TABLE_ACTIVE_PAGE, DEFAULT_TABLE_LIMIT } from './constants';
import {
  Cases,
  Case,
  FilterOptions,
  QueryParams,
  SortFieldCase,
  StatusAll,
  UpdateByKey,
  SeverityAll,
} from './types';
import { useToasts } from '../common/lib/kibana';
import * as i18n from './translations';
import { getCases } from './api';
import { ServerError } from '../types';

export interface UpdateCase extends Omit<UpdateByKey, 'caseData'> {
  caseId: string;
  version: string;
  refetchCasesStatus: () => void;
}

export type Action =
  | { type: 'FETCH_INIT'; payload: string }
  | {
      type: 'FETCH_CASES_SUCCESS';
      payload: Cases;
    }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'FETCH_UPDATE_CASE_SUCCESS' }
  | { type: 'UPDATE_FILTER_OPTIONS'; payload: Partial<FilterOptions> }
  | { type: 'UPDATE_QUERY_PARAMS'; payload: Partial<QueryParams> }
  | { type: 'UPDATE_TABLE_SELECTIONS'; payload: Case[] };

const dataFetchReducer = (state: UseGetCasesState, action: Action): UseGetCasesState => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isError: false,
        loading: [...state.loading.filter((e) => e !== action.payload), action.payload],
      };
    case 'FETCH_UPDATE_CASE_SUCCESS':
      return {
        ...state,
        loading: state.loading.filter((e) => e !== 'caseUpdate'),
      };
    case 'FETCH_CASES_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isError: false,
        loading: state.loading.filter((e) => e !== 'cases'),
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isError: true,
        loading: state.loading.filter((e) => e !== action.payload),
      };
    case 'UPDATE_FILTER_OPTIONS':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          ...action.payload,
        },
      };
    case 'UPDATE_QUERY_PARAMS':
      return {
        ...state,
        queryParams: {
          ...state.queryParams,
          ...action.payload,
        },
      };
    case 'UPDATE_TABLE_SELECTIONS':
      return {
        ...state,
        selectedCases: action.payload,
      };
    default:
      return state;
  }
};

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  search: '',
  severity: SeverityAll,
  reporters: [],
  status: StatusAll,
  tags: [],
  owner: [],
};

export const DEFAULT_QUERY_PARAMS: QueryParams = {
  page: DEFAULT_TABLE_ACTIVE_PAGE,
  perPage: DEFAULT_TABLE_LIMIT,
  sortField: SortFieldCase.createdAt,
  sortOrder: 'desc',
};

export const initialData: Cases = {
  cases: [],
  countClosedCases: 0,
  countInProgressCases: 0,
  countOpenCases: 0,
  page: 0,
  perPage: 0,
  total: 0,
};
export interface UseGetCasesOld extends UseGetCasesState {
  refetchCases: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setQueryParams: (queryParams: Partial<QueryParams>) => void;
  setSelectedCases: (mySelectedCases: Case[]) => void;
}

export const useFetchCases = (
  params: {
    queryParams?: Partial<QueryParams>;
    filterOptions?: Partial<FilterOptions>;
  } = {}
): UseQueryResult<Cases> => {
  const toasts = useToasts();
  return useQuery(
    [CASE_LIST_CACHE_KEY, 'cases', params],
    () => {
      const abortCtrl = new AbortController();
      return getCases({
        filterOptions: {
          ...DEFAULT_FILTER_OPTIONS,
          ...(params.filterOptions ?? {}),
        },
        queryParams: {
          ...DEFAULT_QUERY_PARAMS,
          ...(params.queryParams ?? {}),
        },
        signal: abortCtrl.signal,
      });
    },
    {
      keepPreviousData: true,
      onError: (error: ServerError) => {
        if (error.name !== 'AbortError') {
          toasts.addError(
            error.body && error.body.message ? new Error(error.body.message) : error,
            { title: i18n.ERROR_TITLE }
          );
        }
      },
    }
  );
};

const empty = {};
export const useGetCasesOld = (
  params: {
    initialQueryParams?: Partial<QueryParams>;
    initialFilterOptions?: Partial<FilterOptions>;
  } = {}
): UseGetCasesOld => {
  const { initialQueryParams = empty, initialFilterOptions = empty } = params;
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: initialData,
    filterOptions: {
      ...DEFAULT_FILTER_OPTIONS,
      ...initialFilterOptions,
    },
    isError: false,
    loading: [],
    queryParams: { ...DEFAULT_QUERY_PARAMS, ...initialQueryParams },
    selectedCases: [],
  });
  const toasts = useToasts();
  const didCancelFetchCases = useRef(false);
  const didCancelUpdateCases = useRef(false);
  const abortCtrlFetchCases = useRef(new AbortController());

  const setSelectedCases = useCallback((mySelectedCases: Case[]) => {
    dispatch({ type: 'UPDATE_TABLE_SELECTIONS', payload: mySelectedCases });
  }, []);

  const setQueryParams = useCallback((newQueryParams: Partial<QueryParams>) => {
    dispatch({ type: 'UPDATE_QUERY_PARAMS', payload: newQueryParams });
  }, []);

  const setFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    dispatch({ type: 'UPDATE_FILTER_OPTIONS', payload: newFilters });
  }, []);

  const fetchCases = useCallback(
    async (filterOptions: FilterOptions, queryParams: QueryParams) => {
      try {
        didCancelFetchCases.current = false;
        abortCtrlFetchCases.current.abort();
        abortCtrlFetchCases.current = new AbortController();
        dispatch({ type: 'FETCH_INIT', payload: 'cases' });

        const response = await getCases({
          filterOptions,
          queryParams,
          signal: abortCtrlFetchCases.current.signal,
        });

        if (!didCancelFetchCases.current) {
          dispatch({
            type: 'FETCH_CASES_SUCCESS',
            payload: response,
          });
        }
      } catch (error) {
        if (!didCancelFetchCases.current) {
          if (error.name !== 'AbortError') {
            toasts.addError(
              error.body && error.body.message ? new Error(error.body.message) : error,
              { title: i18n.ERROR_TITLE }
            );
          }
          dispatch({ type: 'FETCH_FAILURE', payload: 'cases' });
        }
      }
    },
    [toasts]
  );

  const refetchCases = useCallback(() => {
    fetchCases(state.filterOptions, state.queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filterOptions, state.queryParams]);

  useEffect(() => {
    fetchCases(state.filterOptions, state.queryParams);
    return () => {
      didCancelFetchCases.current = true;
      didCancelUpdateCases.current = true;
      abortCtrlFetchCases.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.queryParams, state.filterOptions]);

  return {
    ...state,
    refetchCases,
    setFilters,
    setQueryParams,
    setSelectedCases,
  };
};
