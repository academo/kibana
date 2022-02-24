/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import { EuiContextMenuItem } from '@elastic/eui';
import { Case, CommentType } from '../../../../../../cases/common';
import { CaseAttachments } from '../../../../../../cases/public';
import { useGetUserCasesPermissions, useKibana } from '../../../../common/lib/kibana';
import type { TimelineNonEcsData } from '../../../../../common/search_strategy';
import { TimelineId } from '../../../../../common/types';
import { APP_ID } from '../../../../../common/constants';
import { Ecs } from '../../../../../common/ecs';
import { ADD_TO_EXISTING_CASE, ADD_TO_NEW_CASE } from '../translations';

export interface UseAddToCaseActions {
  onMenuItemClick: () => void;
  ariaLabel?: string;
  ecsData?: Ecs;
  nonEcsData?: TimelineNonEcsData[];
  timelineId: string;
}

export const useAddToCaseActions = ({
  onMenuItemClick,
  ariaLabel,
  ecsData,
  nonEcsData,
  timelineId,
}: UseAddToCaseActions) => {
  const { cases: casesUi } = useKibana().services;
  const casePermissions = useGetUserCasesPermissions();
  const casesToasts = casesUi.hooks.useCasesToast();
  const hasWritePermissions = casePermissions?.crud ?? false;

  const caseAttachments: CaseAttachments = useMemo(() => {
    return ecsData?._id
      ? [
          {
            alertId: ecsData?._id ?? '',
            index: ecsData?._index ?? '',
            owner: APP_ID,
            type: CommentType.alert,
            rule: casesUi.helpers.getRuleIdFromEvent({ ecs: ecsData, data: nonEcsData ?? [] }),
          },
        ]
      : [];
  }, [casesUi.helpers, ecsData, nonEcsData]);

  const createCaseFlyout = casesUi.hooks.getUseCasesAddToNewCaseFlyout({
    attachments: caseAttachments,
    onSuccess: async (theCase: Case) => {
      casesToasts.showSuccessAttach(theCase);
    },
    onClose: onMenuItemClick,
  });

  const selectCaseModal = casesUi.hooks.getUseCasesAddToExistingCaseModal({
    attachments: caseAttachments,
    onRowClick: (theCase?: Case) => {
      if (theCase !== undefined) {
        casesToasts.showSuccessAttach(theCase);
      }
    },
    onClose: onMenuItemClick,
  });

  const handleAddToNewCaseClick = useCallback(() => {
    // TODO rename this, this is really `closePopover()`
    onMenuItemClick();
    createCaseFlyout.open();
  }, [onMenuItemClick, createCaseFlyout]);

  const handleAddToExistingCaseClick = useCallback(() => {
    // TODO rename this, this is really `closePopover()`
    onMenuItemClick();
    selectCaseModal.open();
  }, [onMenuItemClick, selectCaseModal]);

  const addToCaseActionItems = useMemo(() => {
    if (
      [
        TimelineId.detectionsPage,
        TimelineId.detectionsRulesDetailsPage,
        TimelineId.active,
      ].includes(timelineId as TimelineId) &&
      hasWritePermissions
    ) {
      return [
        // add to existing case menu item
        <EuiContextMenuItem
          aria-label={ariaLabel}
          data-test-subj="cases-actions-add-to-existing-case"
          onClick={handleAddToExistingCaseClick}
          size="s"
        >
          {ADD_TO_EXISTING_CASE} {'YES'}
        </EuiContextMenuItem>,
        // add to new case menu item
        <EuiContextMenuItem
          aria-label={ariaLabel}
          data-test-subj="cases-actions-add-to-new-case"
          onClick={handleAddToNewCaseClick}
          size="s"
        >
          {ADD_TO_NEW_CASE} {'here'}
        </EuiContextMenuItem>,
      ];
    }
    return [];
  }, [
    ariaLabel,
    handleAddToExistingCaseClick,
    handleAddToNewCaseClick,
    hasWritePermissions,
    timelineId,
  ]);

  return {
    addToCaseActionItems,
  };
};
