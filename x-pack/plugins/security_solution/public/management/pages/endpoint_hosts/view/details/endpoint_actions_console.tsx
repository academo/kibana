/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiSuperSelect,
  EuiTitle,
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { getEndpointActionsConsoleData } from '../../store/selectors';
import { useEndpointSelector } from '../hooks';

export const EndpointActionsConsole = () => {
  const actionsConsoleData = useEndpointSelector(getEndpointActionsConsoleData);
  const [selectedAction, setSelectedAction] = useState('');

  useEffect(() => {
    if (
      actionsConsoleData !== undefined &&
      selectedAction === '' &&
      actionsConsoleData?.availableActions?.length > 0
    ) {
      setSelectedAction(actionsConsoleData.availableActions[0].name);
    }
  }, [actionsConsoleData, selectedAction]);

  const ConsoleActionsDropdown = () => {
    if (actionsConsoleData?.availableActions === undefined) {
      return <></>;
    }
    const selectOptions = [];
    const availableActions = actionsConsoleData?.availableActions ?? [];
    for (const action of availableActions) {
      selectOptions.push({
        value: action.name,
        inputDisplay: action.name,
      });
    }
    return (
      <EuiSuperSelect
        options={selectOptions}
        valueOfSelected={selectedAction}
        onChange={setSelectedAction}
        hasDividers
      />
    );
  };

  return (
    <>
      <EuiTitle size="m">
        <h4>
          <FormattedMessage
            id="xpack.securitySolution.endpoint.actionsConsole.execute"
            defaultMessage="Execute an Action"
          />
        </h4>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiFlexGroup>
        <EuiFlexItem>
          <ConsoleActionsDropdown />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton>
            <FormattedMessage
              id="xpack.securitySolution.endpoint.actionsConsole.execute"
              defaultMessage="Execute"
            />
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
EndpointActionsConsole.displayName = 'EndpointActionsConsole';
