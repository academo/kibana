/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiLoadingContent, EuiLoadingLogo, EuiSpacer } from '@elastic/eui';
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

  useEffect(() => {
    if (actionsConsoleData === undefined) {
      // TODO display loading animation
      dispatch({
        type: 'loadEndpointActionsConsoleData',
      });
    }
  }, [actionsConsoleData, dispatch]);

  if (
    actionsConsoleData === undefined ||
    (selectedEndpoint === undefined && hostData?.length === 0)
  ) {
    return <EuiLoadingContent lines={5} />;
  }

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

  if (isShowingExecuteActionForm) {
    return (
      <>
        <EndpointActionsConsoleExecuteAction
          actionsConsoleData={actionsConsoleData}
          endpointId={selectedEndpoint}
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
