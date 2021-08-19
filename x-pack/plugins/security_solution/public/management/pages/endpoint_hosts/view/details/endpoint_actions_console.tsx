/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable react/jsx-no-literals */

import { EuiButton, EuiLoadingContent, EuiSpacer } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEndpointActionsConsoleData, listData, uiQueryParams } from '../../store/selectors';
import { EndpointActionsConsoleAction } from '../../types';
import { useEndpointSelector } from '../hooks';
import { EndpointActionsConsoleExecuteAction } from './components/actions_console/actions_console_execute';
import { EndpointActionsConsoleHistory } from './components/actions_console/actions_console_history';

export const EndpointActionsConsole = () => {
  const [isShowingExecuteActionForm, setIsShowingExecuteActionForm] = useState(false);

  const actionsConsoleData = useEndpointSelector(getEndpointActionsConsoleData);
  const hostData = useEndpointSelector(listData);
  const queryParams = useEndpointSelector(uiQueryParams);
  const selectedEndpoint = queryParams.selected_endpoint;
  const dispatch = useDispatch();

  // load actions console data if not available
  useEffect(() => {
    if (actionsConsoleData === undefined) {
      dispatch({
        type: 'loadEndpointActionsConsoleData',
      });
    }
  }, [actionsConsoleData, dispatch]);

  // loading animation
  if (
    actionsConsoleData === undefined ||
    (selectedEndpoint === undefined && hostData?.length === 0)
  ) {
    return <EuiLoadingContent lines={5} />;
  }

  const endpointList = hostData?.map((host) => {
    return host.metadata.agent.id;
  });

  // fake submit to API
  const handleSubmit = ({
    action,
    endpointIds,
  }: {
    action: EndpointActionsConsoleAction;
    endpointIds: string[];
  }) => {
    setIsShowingExecuteActionForm(false);
    dispatch({
      type: 'fakeEndpointActionExecuteAction',
      payload: {
        action,
        endpointIds,
      },
    });
  };

  // execute an action view
  if (isShowingExecuteActionForm) {
    return (
      <>
        <EndpointActionsConsoleExecuteAction
          actionsConsoleData={actionsConsoleData}
          endpointId={selectedEndpoint || endpointList}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsShowingExecuteActionForm(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <EuiButton onClick={() => setIsShowingExecuteActionForm(true)}>Execute an Action</EuiButton>
      <EuiSpacer size="m" />
      <EndpointActionsConsoleHistory
        actionsConsoleData={actionsConsoleData}
        endpointId={selectedEndpoint}
      />
    </>
  );
};
EndpointActionsConsole.displayName = 'EndpointActionsConsole';
