/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiSpacer,
  EuiSuperSelect,
  EuiSuperSelectOption,
  EuiTitle,
} from '@elastic/eui';
import React, { useState } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { EndpointActionsConsoleData } from '../../../../types';
import { ImmutableObject } from '../../../../../../../../common/endpoint/types';

export const EndpointActionsConsoleExecuteAction = ({
  actionsConsoleData,
  endpointId,
  onCancel,
}: {
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>;
  endpointId?: string | string[];
  onCancel: () => void;
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  // const [endpoints, setEndpoints] = useState([]);

  const ConsoleActionsDropdown = () => {
    if (actionsConsoleData?.hosts?.length === 0) {
      return <></>;
    }
    const selectOptions: Array<EuiSuperSelectOption<string>> = [];

    // TODO select endpoints
    if (endpointId === undefined) {
      return (
        <>
          <EndpointSelector />
          <EuiButtonEmpty onClick={onCancel}>
            <FormattedMessage
              id="xpack.securitySolution.endpoint.actionsConsole.cancel"
              defaultMessage="Cancel"
            />
          </EuiButtonEmpty>
        </>
      );
    }

    // TODO logic to combine actions possible to all selected `endpointId`
    const endpointData = actionsConsoleData?.hosts.find((host) => host.id === endpointId);

    if (endpointData === undefined) {
      return <NoActionsAvailable onCancel={onCancel} />;
    }

    for (const action of endpointData.availableActions) {
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
      <EuiButtonEmpty onClick={onCancel}>
        <FormattedMessage
          id="xpack.securitySolution.endpoint.actionsConsole.cancel"
          defaultMessage="Cancel"
        />
      </EuiButtonEmpty>
    </>
  );
};
EndpointActionsConsoleExecuteAction.displayName = 'EndpointActionsConsoleExecuteAction';

const EndpointSelector = () => {
  return (
    <>
      <b>
        <FormattedMessage
          id="xpack.securitySolution.endpoint.actionsConsole.todo"
          defaultMessage="TODO - Select an endpoint here"
        />
      </b>
    </>
  );
};
EndpointSelector.displayName = 'EndpointSelector';

const NoActionsAvailable = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <>
      <b>
        <FormattedMessage
          id="xpack.securitySolution.endpoint.actionsConsole.noActions"
          defaultMessage="No actions available for this endpoint"
        />
      </b>
      <EuiButtonEmpty onClick={onCancel}>
        <FormattedMessage
          id="xpack.securitySolution.endpoint.actionsConsole.return"
          defaultMessage="Return"
        />
      </EuiButtonEmpty>
    </>
  );
};
NoActionsAvailable.displayName = 'NoActionsAvailable';
