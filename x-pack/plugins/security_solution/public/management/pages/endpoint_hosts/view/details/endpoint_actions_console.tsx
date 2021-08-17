/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer } from '@elastic/eui';
import React from 'react';
import { getEndpointActionsConsoleData } from '../../store/selectors';
import { useEndpointSelector } from '../hooks';
import { EndpointActionsConsoleExecuteAction } from './components/actions_console/actions_console_execute';
import { EndpointActionsConsoleHistory } from './components/actions_console/actions_console_history';

export const EndpointActionsConsole = () => {
  const actionsConsoleData = useEndpointSelector(getEndpointActionsConsoleData);

  if (actionsConsoleData === undefined) {
    // TODO display loading animation
    return <></>;
  }

  return (
    <>
      <EndpointActionsConsoleExecuteAction actionsConsoleData={actionsConsoleData} />
      <EuiSpacer size="m" />
      <EndpointActionsConsoleHistory actionsConsoleData={actionsConsoleData} />
    </>
  );
};
EndpointActionsConsole.displayName = 'EndpointActionsConsole';
