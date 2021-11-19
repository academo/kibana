/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  CreateExceptionListItemSchema,
  UpdateExceptionListItemSchema,
} from '@kbn/securitysolution-io-ts-list-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { PolicyData } from '../../../../../../common/endpoint/types';
import {
  EffectedPolicySelect,
  EffectedPolicySelection,
  EffectedPolicySelectProps,
} from '../../../../components/effected_policy_select';
import {
  getArtifactTagsByEffectedPolicySelection,
  getEffectedPolicySelectionByTags,
  isGlobalPolicyEffected,
} from '../../../../components/effected_policy_select/utils';
import { isValidIPv4OrCIDR } from '../../utils';
import {
  DESCRIPTION_LABEL,
  DESCRIPTION_PLACEHOLDER,
  IP_ERROR,
  IP_LABEL,
  IP_PLACEHOLDER,
  NAME_ERROR,
  NAME_LABEL,
  NAME_PLACEHOLDER,
} from './translations';

interface ExceptionIpEntry {
  field: 'destination.ip';
  operator: 'included';
  type: 'match';
  value: string;
}

export const HostIsolationExceptionsForm: React.FC<{
  exception: CreateExceptionListItemSchema | UpdateExceptionListItemSchema;
  policies: PolicyData[];
  onError: (error: boolean) => void;
  onChange: (exception: CreateExceptionListItemSchema | UpdateExceptionListItemSchema) => void;
}> = memo(({ exception, onError, policies, onChange }) => {
  const ipEntry = exception.entries[0] as ExceptionIpEntry;
  const [hasBeenInputNameVisited, setHasBeenInputNameVisited] = useState(false);
  const [hasBeenInputIpVisited, setHasBeenInputIpVisited] = useState(false);
  const [hasNameError, setHasNameError] = useState(!exception.name);
  const [hasIpError, setHasIpError] = useState(!ipEntry.value);

  const [isGlobal, setIsGlobal] = useState(isGlobalPolicyEffected(exception.tags));
  const [selectedPolicies, setSelectedPolicies] = useState<EffectedPolicySelection>({
    isGlobal,
    selected: [],
  });

  // set current policies if not previously selected
  useEffect(() => {
    if (selectedPolicies.selected.length === 0) {
      setSelectedPolicies(getEffectedPolicySelectionByTags(exception.tags || [], policies));
    }
  }, [exception.tags, policies, selectedPolicies.selected.length]);

  useEffect(() => {
    onError(hasNameError || hasIpError);
  }, [hasNameError, hasIpError, onError]);

  const handleOnChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      if (!name.trim()) {
        setHasNameError(true);
        return;
      }
      setHasNameError(false);
      onChange({ ...exception, name });
    },
    [exception, onChange]
  );

  const handleOnIpChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const ip = event.target.value;
      if (!isValidIPv4OrCIDR(ip)) {
        setHasIpError(true);
        return;
      }
      setHasIpError(false);
      onChange({
        ...exception,
        entries: [
          {
            field: 'destination.ip',
            operator: 'included',
            type: 'match',
            value: ip,
          },
        ],
      });
    },
    [exception, onChange]
  );

  const handlePolicySelectChange: EffectedPolicySelectProps['onChange'] = useCallback(
    (selection) => {
      setIsGlobal(selection.isGlobal);

      // preseve the previous selection between global and not global toggle
      if (!selection.isGlobal) {
        setSelectedPolicies(() => selection);
      }
      onChange({
        ...exception,
        tags: getArtifactTagsByEffectedPolicySelection(selection),
      });
    },
    [exception, onChange]
  );

  const handleOnDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...exception, description: event.target.value });
    },
    [exception, onChange]
  );

  const nameInput = (
    <EuiFormRow
      label={NAME_LABEL}
      fullWidth
      isInvalid={hasNameError && hasBeenInputNameVisited}
      error={NAME_ERROR}
    >
      <EuiFieldText
        id="eventFiltersFormInputName"
        placeholder={NAME_PLACEHOLDER}
        defaultValue={exception.name ?? ''}
        onChange={handleOnChangeName}
        fullWidth
        aria-label={NAME_PLACEHOLDER}
        required={hasBeenInputNameVisited}
        maxLength={256}
        data-test-subj="hostIsolationExceptions-form-name-input"
        onBlur={() => !hasBeenInputNameVisited && setHasBeenInputNameVisited(true)}
      />
    </EuiFormRow>
  );

  const ipInput = (
    <EuiFormRow
      label={IP_LABEL}
      fullWidth
      isInvalid={hasIpError && hasBeenInputIpVisited}
      error={IP_ERROR}
    >
      <EuiFieldText
        id="eventFiltersFormInputName"
        placeholder={IP_PLACEHOLDER}
        defaultValue={(exception.entries?.[0] as ExceptionIpEntry)?.value ?? ''}
        onChange={handleOnIpChange}
        fullWidth
        aria-label={IP_PLACEHOLDER}
        required={hasBeenInputIpVisited}
        maxLength={256}
        data-test-subj="hostIsolationExceptions-form-ip-input"
        onBlur={() => !hasBeenInputIpVisited && setHasBeenInputIpVisited(true)}
      />
    </EuiFormRow>
  );

  const descriptionInput = (
    <EuiFormRow label={DESCRIPTION_LABEL} fullWidth>
      <EuiTextArea
        id="eventFiltersFormInputName"
        placeholder={DESCRIPTION_PLACEHOLDER}
        defaultValue={exception.description ?? ''}
        onChange={handleOnDescriptionChange}
        fullWidth
        data-test-subj="hostIsolationExceptions-form-description-input"
        aria-label={DESCRIPTION_PLACEHOLDER}
        maxLength={256}
      />
    </EuiFormRow>
  );

  return (
    <EuiForm component="div">
      <EuiTitle size="xs">
        <h2>
          <FormattedMessage
            id="xpack.securitySolution.hostIsolationExceptions.form.title"
            defaultMessage="Details"
          />
        </h2>
      </EuiTitle>
      <EuiText size="s">
        <FormattedMessage
          id="xpack.securitySolution.hostIsolationExceptions.form.description"
          defaultMessage="Allows isolated hosts to connect to these IP addresses. Only accepts IPv4 with optional CIDR."
        />
      </EuiText>
      <EuiSpacer size="m" />
      {nameInput}
      {descriptionInput}
      <EuiSpacer size="m" />
      <EuiHorizontalRule />
      <EuiTitle size="xs">
        <h2>
          <FormattedMessage
            id="xpack.securitySolution.hostIsolationExceptions.form.conditions.title"
            defaultMessage="Conditions"
          />
        </h2>
      </EuiTitle>
      <EuiText size="s">
        <FormattedMessage
          id="xpack.securitySolution.hostIsolationExceptions.form.conditions.subtitle"
          defaultMessage="Host Isolation exceptions will apply to all operating systems."
        />
      </EuiText>
      <EuiSpacer size="m" />
      {ipInput}
      <EuiHorizontalRule />
      <EuiFormRow data-test-subj={'effectedPolicies-container'}>
        <EffectedPolicySelect
          isGlobal={isGlobal}
          isPlatinumPlus={true}
          selected={selectedPolicies.selected}
          options={policies}
          onChange={handlePolicySelectChange}
          data-test-subj={'effectedPolicies-select'}
        />
      </EuiFormRow>
    </EuiForm>
  );
});

HostIsolationExceptionsForm.displayName = 'HostIsolationExceptionsForm';
