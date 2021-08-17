/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiSpacer, EuiSuperSelect, EuiTitle } from '@elastic/eui';
import React, { useState } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { EndpointActionsConsoleData } from '../../../../types';
import { ImmutableObject } from '../../../../../../../../common/endpoint/types';

export const EndpointActionsConsoleExecuteAction = ({
  actionsConsoleData,
}: {
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>;
}) => {
  const [selectedAction, setSelectedAction] = useState('');

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
      <ConsoleActionsDropdown />
      <EuiSpacer size="s" />
      <EuiButton>
        <FormattedMessage
          id="xpack.securitySolution.endpoint.actionsConsole.execute"
          defaultMessage="Execute"
        />
      </EuiButton>
    </>
  );
};

EndpointActionsConsoleExecuteAction.displayName = 'EndpointActionsConsoleExecuteAction';
