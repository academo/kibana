/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FoundExceptionListItemSchema } from '@kbn/securitysolution-io-ts-list-types';
import { CoreStart, HttpStart } from 'kibana/public';
import { matchPath } from 'react-router-dom';
import { AppLocation, Immutable } from '../../../../../common/endpoint/types';
import { ImmutableMiddleware, ImmutableMiddlewareAPI } from '../../../../common/store';
import { AppAction } from '../../../../common/store/actions';
import { MANAGEMENT_ROUTING_HOST_ISOLATION_EXCEPTIONS_PATH } from '../../../common/constants';
import { parseQueryFilterToKQL } from '../../../common/utils';
import {
  createFailedResourceState,
  createLoadedResourceState,
} from '../../../state/async_resource_builders';
import { getHostIsolationExceptionsList } from '../service';
import { HostIsolationExceptionsPageState } from '../types';
import { getCurrentListPageDataState, getCurrentLocation } from './selector';

export const SEARCHABLE_FIELDS: Readonly<string[]> = [`name`, `description`, `entries.value`];

export function hostIsolationExceptionsMiddlewareFactory(coreStart: CoreStart) {
  return createHostIsolationExceptionsPageMiddleware(coreStart);
}

export const createHostIsolationExceptionsPageMiddleware = (
  coreStart: CoreStart
): ImmutableMiddleware<HostIsolationExceptionsPageState, AppAction> => {
  return (store) => (next) => async (action) => {
    next(action);

    if (action.type === 'userChangedUrl' && isHostIsolationExceptionsPage(action.payload)) {
      loadHostIsolationExceptionsList(store, coreStart.http);
    }
  };
};

async function loadHostIsolationExceptionsList(
  store: ImmutableMiddlewareAPI<HostIsolationExceptionsPageState, AppAction>,
  http: HttpStart
) {
  const { dispatch } = store;
  try {
    const {
      page_size: pageSize,
      page_index: pageIndex,
      filter,
    } = getCurrentLocation(store.getState());
    const query = {
      http,
      page: pageIndex + 1,
      perPage: pageSize,
      filter: parseQueryFilterToKQL(filter, SEARCHABLE_FIELDS) || undefined,
    };
    const entries = await getHostIsolationExceptionsList(query);

    dispatch({
      type: 'hostIsolationExceptionsPageDataChanged',
      payload: {
        // Ignore will be fixed with when AsyncResourceState is refactored (#830)
        // @ts-ignore
        type: 'LoadingResourceState',
        // @ts-ignore
        previousState: getCurrentListPageDataState(store.getState()),
      },
    });

    dispatch({
      type: 'hostIsolationExceptionsPageDataChanged',
      payload: createLoadedResourceState(entries),
    });
  } catch (error) {
    dispatch({
      type: 'hostIsolationExceptionsPageDataChanged',
      payload: createFailedResourceState<FoundExceptionListItemSchema>(error.body ?? error),
    });
  }
}

function isHostIsolationExceptionsPage(location: Immutable<AppLocation>) {
  return (
    matchPath(location.pathname ?? '', {
      path: MANAGEMENT_ROUTING_HOST_ISOLATION_EXCEPTIONS_PATH,
      exact: true,
    }) !== null
  );
}
