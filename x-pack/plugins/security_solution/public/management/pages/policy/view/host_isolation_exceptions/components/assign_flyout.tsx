/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { isEmpty, without } from 'lodash/fp';
import React, { useMemo, useState } from 'react';
import { PolicyData } from '../../../../../../../common/endpoint/types';
import { SearchExceptions } from '../../../../../components/search_exceptions';
import { useFetchHostIsolationExceptionsList } from '../../../../host_isolation_exceptions/view/hooks';
import { PolicyArtifactsAssignableList } from '../../artifacts/assignable';

const MAX_ALLOWED_RESULTS = 100;

export const PolicyHostIsolationExceptionsAssignFlyout = ({
  policy,
  onClose,
}: {
  policy: PolicyData;
  onClose: () => void;
}) => {
  const [selectedArtifactIds, setSelectedArtifactIds] = useState<string[]>([]);

  const [currentFilter, setCurrentFilter] = useState('');

  const exceptionsRequest = useFetchHostIsolationExceptionsList({
    excludedPolicies: [policy.id, 'all'],
    page: 0,
    filter: currentFilter,
    perPage: MAX_ALLOWED_RESULTS,
  });

  const handleOnConfirmAction = () => {};

  const handleSelectArtifact = (artifactId: string, selected: boolean) => {
    setSelectedArtifactIds((currentSelectedArtifactIds) =>
      selected
        ? [...currentSelectedArtifactIds, artifactId]
        : without([artifactId], currentSelectedArtifactIds)
    );
  };

  const searchWarningMessage = useMemo(
    () => (
      <>
        <EuiCallOut
          data-test-subj="hostIsolationExceptions-too-many-results"
          color="warning"
          size="s"
          heading="h4"
          title={i18n.translate(
            'xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.searchWarning.title',
            {
              defaultMessage: 'Limited search results',
            }
          )}
        >
          {i18n.translate(
            'xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.searchWarning.text',
            {
              defaultMessage:
                'Only the first 100 host isolation exceptions are displayed. Please use the search bar to refine the results.',
            }
          )}
        </EuiCallOut>
        <EuiSpacer size="m" />
      </>
    ),
    []
  );
  // <EuiEmptyPrompt
  //   data-test-subj="hostIsolationExceptions-no-assignable-items"
  //   title={
  //     <FormattedMessage
  //       id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.noAssignable"
  //       defaultMessage="There are no host isolation exceptions that can be assigned to this policy."
  //     />
  //   }
  // />

  return (
    <EuiFlyout onClose={onClose}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>
            <FormattedMessage
              id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.title"
              defaultMessage="Assign host isolation exceptions"
            />
          </h2>
        </EuiTitle>
        <EuiSpacer size="m" />
        <FormattedMessage
          id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.subtitle"
          defaultMessage="Select host isolation exceptions to add to {policyName}"
          values={{ policyName: policy.name }}
        />
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        {(exceptionsRequest.data?.total || 0) > MAX_ALLOWED_RESULTS ? searchWarningMessage : null}
        <SearchExceptions
          onSearch={setCurrentFilter}
          placeholder={i18n.translate(
            'xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.searh.label',
            {
              defaultMessage: 'Search host isolation exceptions',
            }
          )}
          hideRefreshButton
        />
        <EuiSpacer size="m" />

        {!exceptionsRequest.isLoading ? (
          <PolicyArtifactsAssignableList
            data-test-subj="hostIsolationExceptions-assignable-list"
            artifacts={exceptionsRequest.data}
            selectedArtifactIds={selectedArtifactIds}
            isListLoading={exceptionsRequest.isLoading}
            selectedArtifactsUpdated={handleSelectArtifact}
          />
        ) : null}

        {exceptionsRequest.data?.total === 0 ? (
          <EuiEmptyPrompt
            data-test-subj="noItemsFoundTrustedAppsFlyout"
            title={
              <FormattedMessage
                id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.noResults"
                defaultMessage="No items found"
              />
            }
          />
        ) : null}
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              data-test-subj="hostIsolationExceptions-assign-cancel-button"
              onClick={onClose}
            >
              <FormattedMessage
                id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.cancel"
                defaultMessage="Cancel"
              />
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              className="eui-textTruncate"
              style={{ maxWidth: '300px' }}
              data-test-subj="hostIsolationExceptions-assign-confirm-button"
              fill
              onClick={handleOnConfirmAction}
              isLoading={exceptionsRequest.isLoading}
              disabled={isEmpty(selectedArtifactIds)}
              title={policy.name}
            >
              <FormattedMessage
                id="xpack.securitySolution.endpoint.policy.hostIsolationExceptions.layout.flyout.confirm"
                defaultMessage="Assign to {policyName}"
                values={{
                  policyName: policy.name,
                }}
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};
