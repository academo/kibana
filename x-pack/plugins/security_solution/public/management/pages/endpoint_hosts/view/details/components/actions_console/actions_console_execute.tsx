/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFieldText,
  EuiFilePicker,
  EuiFormRow,
  EuiRadioGroup,
  EuiSpacer,
  EuiSuperSelect,
  EuiTitle,
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  EndpointActionsConsoleAction,
  EndpointActionsConsoleActionParameter,
  EndpointActionsConsoleData,
} from '../../../../types';
import { ImmutableObject } from '../../../../../../../../common/endpoint/types';

export const EndpointActionsConsoleExecuteAction = ({
  actionsConsoleData,
  endpointId,
  onCancel,
  onSubmit,
}: {
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>;
  endpointId: string | string[];
  onCancel: () => void;
  onSubmit: ({
    action,
    endpointIds,
  }: {
    action: EndpointActionsConsoleAction;
    endpointIds: string[];
  }) => void;
}) => {
  const [selectedAction, setSelectedAction] = useState({
    name: '',
    params: [],
  } as EndpointActionsConsoleAction);
  const [payload, setPayload] = useState([]);
  const [selectedEndpoints, setSelectedEndpoints] = useState([] as string[]);

  const endpointList = Array.isArray(endpointId) ? endpointId : [endpointId];

  // TODO logic to combine actions possible to all selected `endpointId`
  const endpointData = actionsConsoleData?.hosts[0];

  if (endpointData === undefined) {
    return <NoActionsAvailable onCancel={onCancel} />;
  }

  const selectOptions: Array<{ value: EndpointActionsConsoleAction; inputDisplay: string }> = [];

  for (const action of endpointData.availableActions) {
    selectOptions.push({
      value: action,
      inputDisplay: action.name,
    });
  }

  const selectAction = (selected: EndpointActionsConsoleAction) => {
    setSelectedAction(selected);
  };

  const handleParamsChange = (paramsData: any) => {
    setPayload(paramsData);
  };

  const doSubmit = () => {
    const endpointIds = endpointList.length === 1 ? endpointList : selectedEndpoints;
    onSubmit({
      action: {
        ...selectedAction,
        params: payload,
      },
      endpointIds,
    });
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
      {Array.isArray(endpointId) ? (
        <EuiFormRow label={'Select Endpoints'}>
          <EndpointSelector endpointList={endpointList} onChange={setSelectedEndpoints} />
        </EuiFormRow>
      ) : (
        ''
      )}
      <EuiSpacer size="s" />
      <EuiFormRow label={'Select an Action'}>
        <EuiSuperSelect
          options={selectOptions}
          valueOfSelected={selectedAction}
          onChange={selectAction}
          hasDividers
        />
      </EuiFormRow>
      <EuiSpacer size="s" />
      {selectedAction?.params?.length > 0 ? (
        <ActionParametersForm params={selectedAction.params} onChange={handleParamsChange} />
      ) : (
        ''
      )}
      <EuiSpacer size="s" />
      <EuiButton onClick={doSubmit}>
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

const ActionParametersForm = ({
  params,
  onChange,
}: {
  params: EndpointActionsConsoleActionParameter[];
  onChange: (payload: Array<{ name: string; value: string }>) => void;
}) => {
  const [formData, setFormData] = useState(
    {} as Record<string, EndpointActionsConsoleActionParameter>
  );
  if (params.length === 0) {
    return <></>;
  }
  const updateParamsData = (field: EndpointActionsConsoleActionParameter) => {
    formData[field.name] = field;
    setFormData(formData);
    onChange(
      Object.entries(formData).map((entry) => {
        return {
          name: entry[1].name,
          value: entry[1].value ?? '',
        };
      })
    );
  };
  return (
    <>
      {params.map((param) => (
        <ActionParametersElement key={param.name} param={param} onChange={updateParamsData} />
      ))}
    </>
  );
};

const ActionParametersElement = ({
  param,
  onChange,
}: {
  param: EndpointActionsConsoleActionParameter;
  onChange: (param: EndpointActionsConsoleActionParameter) => void;
}) => {
  const [selected, setSelected] = useState('');
  const handleChange = (value: any) => {
    // is a file
    if (typeof value === 'string') {
      setSelected(value);
      onChange({
        ...param,
        value,
      });
    } else if (typeof value === 'object' && value.length > 0) {
      onChange({
        ...param,
        value: value[0].name,
      });
      // text case
    } else if (value?.target?.value?.length > 0) {
      onChange({
        ...param,
        value: value.target.value,
      });
      // select case
    }
  };
  switch (param.type) {
    case 'string':
      return (
        <EuiFormRow label={param.label}>
          <EuiFieldText onChange={handleChange} />
        </EuiFormRow>
      );
    case 'file':
      return (
        <EuiFormRow label={param.label}>
          <EuiFilePicker
            onChange={handleChange}
            initialPromptText={param.label}
            compressed={true}
            display={'default'}
          />
        </EuiFormRow>
      );
    case 'select':
      if (param.options === undefined || param.options?.length === 0) {
        return null;
      }
      return (
        <EuiFormRow>
          <EuiRadioGroup
            idSelected={selected || param.options[0].id}
            onChange={handleChange}
            options={param.options}
            name={param.label}
            legend={{
              children: param.label,
            }}
          />
        </EuiFormRow>
      );
  }
};

const EndpointSelector = ({
  endpointList,
  onChange,
}: {
  endpointList: string[];
  onChange: (endpoints: string[]) => void;
}) => {
  const [selectedOptions, setSelected] = useState([] as Array<{ label: string }>);
  const [options, setOptions] = useState([] as Array<{ label: string }>);

  const handleChange = (newSelection: any) => {
    setSelected(newSelection);
    onChange(newSelection.map((option: any) => option.label));
  };

  useEffect(() => {
    const parsedOptions = endpointList.map((endpoint) => ({
      label: endpoint,
    }));
    setOptions(parsedOptions);

    const preSelected = parsedOptions.length === 1 ? [parsedOptions[0]] : [];
    setSelected(preSelected);
  }, [endpointList]);

  return (
    <>
      <EuiComboBox
        placeholder="Select endpoints"
        options={options}
        selectedOptions={selectedOptions}
        onChange={handleChange}
        isClearable={true}
      />
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
