/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useMemo } from 'react';
import { APP_ID } from '../../../../../common/constants';
import type { TimelineItem } from '../../../../../common/search_strategy';
import { useKibana } from '../../../../common/lib/kibana';
import { ADD_TO_CASE_DISABLED, ADD_TO_EXISTING_CASE, ADD_TO_NEW_CASE } from '../translations';

export interface UseAddToCaseActions {
  onClose?: () => void;
  onSuccess?: () => Promise<void>;
}

export const useBulkAddToCaseActions = ({ onClose, onSuccess }: UseAddToCaseActions = {}) => {
  const { cases: casesUi } = useKibana().services;

  const createCaseFlyout = casesUi.hooks.getUseCasesAddToNewCaseFlyout({
    attachments: [],
    onClose,
    onSuccess,
  });
  const selectCaseModal = casesUi.hooks.getUseCasesAddToExistingCaseModal({
    attachments: [],
    onClose,
    onRowClick: onSuccess,
  });

  return useMemo(() => {
    return [
      {
        label: ADD_TO_NEW_CASE,
        key: 'attach-new-case',
        'data-test-subj': 'attach-new-case',
        disableOnQuery: true,
        disabledLabel: ADD_TO_CASE_DISABLED,
        onClick: (items?: TimelineItem[]) => {
          const caseAttachments = items ? casesUi.helpers.groupAlertsByRule(items, APP_ID) : [];
          createCaseFlyout.open(caseAttachments);
        },
      },
      {
        label: ADD_TO_EXISTING_CASE,
        key: 'attach-existing-case',
        disableOnQuery: true,
        disabledLabel: ADD_TO_CASE_DISABLED,
        'data-test-subj': 'attach-new-case',
        onClick: (items?: TimelineItem[]) => {
          const caseAttachments = items ? casesUi.helpers.groupAlertsByRule(items, APP_ID) : [];
          selectCaseModal.open(caseAttachments);
        },
      },
    ];
  }, [casesUi, createCaseFlyout, selectCaseModal]);
};
