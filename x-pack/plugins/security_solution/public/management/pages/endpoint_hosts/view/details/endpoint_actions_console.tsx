/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiSpacer } from '@elastic/eui';
import React, { useState } from 'react';
import { getEndpointActionsConsoleData, uiQueryParams } from '../../store/selectors';
import { useEndpointSelector } from '../hooks';
import { EndpointActionsConsoleExecuteAction } from './components/actions_console/actions_console_execute';
import { EndpointActionsConsoleHistory } from './components/actions_console/actions_console_history';

export const EndpointActionsConsole = () => {
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  const actionsConsoleData = useEndpointSelector(getEndpointActionsConsoleData);
  const queryParams = useEndpointSelector(uiQueryParams);
  const selectedEndpoint = queryParams.selected_endpoint;

  if (actionsConsoleData === undefined) {
    // TODO display loading animation
    return <></>;
  }

  if (isExecutingAction) {
    return (
      <>
        <EndpointActionsConsoleExecuteAction
          actionsConsoleData={actionsConsoleData}
          endpointId={selectedEndpoint}
          onCancel={() => {
            setIsExecutingAction(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <EuiButton onClick={() => setIsExecutingAction(true)}>Execute an Action</EuiButton>
      <EuiSpacer size="m" />
      <EndpointActionsConsoleHistory
        actionsConsoleData={actionsConsoleData}
        endpointId={selectedEndpoint}
      />
    </>
  );
};
EndpointActionsConsole.displayName = 'EndpointActionsConsole';
