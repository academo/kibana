/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ExceptionListItemSchema,
  FoundExceptionListItemSchema,
} from '@kbn/securitysolution-io-ts-list-types';
import { i18n } from '@kbn/i18n';
import React, { useCallback, useEffect, useState } from 'react';
import { EuiButton, EuiText, EuiSpacer } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ServerApiError } from '../../../../common/types';
import { useHttp } from '../../../../common/lib/kibana';
import { ExceptionItem } from '../../../../common/components/exceptions/viewer/exception_item';
import { getCurrentLocation, getListPagination } from '../store/selector';
import {
  useHostIsolationExceptionsNavigateCallback,
  useHostIsolationExceptionsSelector,
} from './hooks';
import { PaginatedContent, PaginatedContentProps } from '../../../components/paginated_content';
import { Immutable } from '../../../../../common/endpoint/types';
import { AdministrationListPage } from '../../../components/administration_list_page';
import { SearchExceptions } from '../../../components/search_exceptions';
import { ArtifactEntryCard, ArtifactEntryCardProps } from '../../../components/artifact_entry_card';
import { HostIsolationExceptionsEmptyState } from './components/empty';
import { HostIsolationExceptionDeleteModal } from './components/delete_modal';
import { HostIsolationExceptionsFormFlyout } from './components/form_flyout';
import {
  DELETE_HOST_ISOLATION_EXCEPTION_LABEL,
  EDIT_HOST_ISOLATION_EXCEPTION_LABEL,
} from './components/translations';
import { getEndpointListPath } from '../../../common/routing';
import { useEndpointPrivileges } from '../../../../common/components/user_privileges/endpoint';
import { getHostIsolationExceptionItems } from '../service';
import { parseQueryFilterToKQL } from '../../../common/utils';

type HostIsolationExceptionPaginatedContent = PaginatedContentProps<
  Immutable<ExceptionListItemSchema>,
  typeof ExceptionItem
>;
const SEARCHABLE_FIELDS: Readonly<string[]> = [`name`, `description`, `entries.value`];

export const HostIsolationExceptionsList = () => {
  const http = useHttp();
  const history = useHistory();
  const privileges = useEndpointPrivileges();

  const location = useHostIsolationExceptionsSelector(getCurrentLocation);
  const pagination = useHostIsolationExceptionsSelector(getListPagination);
  const navigateCallback = useHostIsolationExceptionsNavigateCallback();

  const [itemToDelete, setItemToDelete] = useState<ExceptionListItemSchema | null>(null);


  const { isLoading, data, error, refetch } = useQuery<
    FoundExceptionListItemSchema,
    ServerApiError
  >(['hostIsolationExceptions', location], () => {
    return getHostIsolationExceptionItems({
      http,
      page: location.page_index + 1,
      perPage: location.page_size,
      filter: parseQueryFilterToKQL(location.filter, SEARCHABLE_FIELDS) || undefined,
    });
  });

  const listItems = data?.data || [];
  const totalCountListItems = data?.total || 0;

  const [itemToDelete, setItemToDelete] = useState<ExceptionListItemSchema | null>(null);

  const showFlyout = privileges.canIsolateHost && !!location.show;
  const hasDataToShow = !!location.filter || listItems.length > 0;

  useEffect(() => {
    if (!isLoading && listItems.length === 0 && !privileges.canIsolateHost) {
      history.replace(getEndpointListPath({ name: 'endpointList' }));
    }
  }, [history, isLoading, listItems.length, privileges.canIsolateHost]);

  const handleOnSearch = useCallback(
    (query: string) => {
      navigateCallback({ filter: query });
    },
    [navigateCallback]
  );

  function handleItemComponentProps(element: ExceptionListItemSchema): ArtifactEntryCardProps {
    const editAction = {
      icon: 'controlsHorizontal',
      onClick: () => {
        navigateCallback({
          show: 'edit',
          id: element.id,
        });
      },
      'data-test-subj': 'editHostIsolationException',
      children: EDIT_HOST_ISOLATION_EXCEPTION_LABEL,
    };
    const deleteAction = {
      icon: 'trash',
      onClick: () => {
        setItemToDelete(element);
      },
      'data-test-subj': 'deleteHostIsolationException',
      children: DELETE_HOST_ISOLATION_EXCEPTION_LABEL,
    };
    return {
      item: element,
      'data-test-subj': `hostIsolationExceptionsCard`,
      actions: privileges.canIsolateHost ? [editAction, deleteAction] : [deleteAction],
    };
  }

  const handlePaginatedContentChange: HostIsolationExceptionPaginatedContent['onChange'] =
    useCallback(
      ({ pageIndex, pageSize }) => {
        navigateCallback({
          page_index: pageIndex,
          page_size: pageSize,
        });
      },
      [navigateCallback]
    );

  const handleAddButtonClick = useCallback(
    () =>
      navigateCallback({
        show: 'create',
        id: undefined,
      }),
    [navigateCallback]
  );

  const handleCloseDeleteDialog = (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      refetch();
    }
    setItemToDelete(null);
  };

  return (
    <AdministrationListPage
      title={
        <FormattedMessage
          id="xpack.securitySolution.hostIsolationExceptions.list.pageTitle"
          defaultMessage="Host isolation exceptions"
        />
      }
      subtitle={
        <FormattedMessage
          id="xpack.securitySolution.hostIsolationExceptions.list.pageSubTitle"
          defaultMessage="Add a Host isolation exception to allow isolated hosts to communicate with specific IPs."
        />
      }
      actions={
        privileges.canIsolateHost && hasDataToShow ? (
          <EuiButton
            fill
            iconType="plusInCircle"
            isDisabled={showFlyout}
            onClick={handleAddButtonClick}
            data-test-subj="hostIsolationExceptionsListAddButton"
          >
            <FormattedMessage
              id="xpack.securitySolution.hostIsolationExceptions.list.addButton"
              defaultMessage="Add Host isolation exception"
            />
          </EuiButton>
        ) : (
          []
        )
      }
      hideHeader={!hasDataToShow}
    >
      {showFlyout && <HostIsolationExceptionsFormFlyout />}

      {itemToDelete ? (
        <HostIsolationExceptionDeleteModal item={itemToDelete} onCancel={handleCloseDeleteDialog} />
      ) : null}

      {hasDataToShow ? (
        <>
          <SearchExceptions
            defaultValue={location.filter}
            onSearch={handleOnSearch}
            placeholder={i18n.translate(
              'xpack.securitySolution.hostIsolationExceptions.search.placeholder',
              {
                defaultMessage: 'Search on the fields below: name, description, ip',
              }
            )}
          />
          <EuiSpacer size="m" />
          <EuiText color="subdued" size="xs" data-test-subj="hostIsolationExceptions-totalCount">
            <FormattedMessage
              id="xpack.securitySolution.hostIsolationExceptions.list.totalCount"
              defaultMessage="Showing {total, plural, one {# exception} other {# exceptions}}"
              values={{ total: totalCountListItems }}
            />
          </EuiText>
          <EuiSpacer size="s" />
        </>
      ) : null}

      <PaginatedContent<ExceptionListItemSchema, typeof ArtifactEntryCard>
        items={listItems}
        ItemComponent={ArtifactEntryCard}
        itemComponentProps={handleItemComponentProps}
        onChange={handlePaginatedContentChange}
        error={error?.message}
        loading={isLoading}
        pagination={pagination}
        contentClassName="host-isolation-exceptions-container"
        data-test-subj="hostIsolationExceptionsContent"
        noItemsMessage={
          !hasDataToShow && <HostIsolationExceptionsEmptyState onAdd={handleAddButtonClick} />
        }
      />
    </AdministrationListPage>
  );
};

HostIsolationExceptionsList.displayName = 'HostIsolationExceptionsList';
