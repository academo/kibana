/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import {
  EuiBasicTable,
  EuiHealth,
  EuiTitle,
  EuiSpacer,
  EuiButtonIcon,
  EuiText,
  EuiPanel,
  EuiLoadingSpinner,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { EndpointActionsConsoleData } from '../../../../types';
import { ImmutableObject } from '../../../../../../../../common/endpoint/types';

export const EndpointActionsConsoleHistory = ({
  actionsConsoleData,
  endpointId,
}: {
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>;
  endpointId?: string;
}) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  if (actionsConsoleData?.hosts?.length === 0) {
    // TODO show loading
    return <></>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleDetails = (item: any) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {
      itemIdToExpandedRowMapValues[item.id] = (
        <EuiPanel hasShadow={true}>
          <EuiTitle size="xs">
            <h5>
              <FormattedMessage
                id="xpack.securitySolution.endpoint.actionsConsole.actionResponse"
                defaultMessage="Response"
              />
            </h5>
          </EuiTitle>
          <EuiSpacer size="s" />
          <EuiText grow={true}>{item.response}</EuiText>
        </EuiPanel>
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const columns = [
    {
      field: 'endpoint',
      name: 'Endpoint',
      sortable: true,
    },
    {
      field: 'startDate',
      name: 'Start Date',
      sortable: true,
    },
    {
      field: 'endDate',
      name: 'End Date',
      sortable: true,
    },
    {
      field: 'action',
      name: 'Action Name',
      sortable: true,
      render: (action: { name: string }) => {
        return action.name;
      },
    },
    {
      field: 'status',
      name: 'Status',
      dataType: 'boolean',
      // eslint-disable-next-line react/display-name
      render: (status: string) => {
        switch (status) {
          case 'failed':
            return <EuiHealth color={'danger'}>{status}</EuiHealth>;
          case 'done':
            return <EuiHealth color={'success'}>{status}</EuiHealth>;
          case 'pending':
            return (
              <>
                <EuiLoadingSpinner size="s" />
                <EuiHealth color={'text'}>{status}</EuiHealth>
              </>
            );
        }
      },
    },
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      // eslint-disable-next-line react/display-name
      render: (item: { response: unknown; id: string | number }) =>
        item.response ? (
          <EuiButtonIcon
            onClick={() => toggleDetails(item)}
            aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
            iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
          />
        ) : (
          ''
        ),
    },
  ];

  const items = getTableItems(actionsConsoleData, endpointId);

  return (
    <>
      <EuiTitle size="m">
        <h4>
          <FormattedMessage
            id="xpack.securitySolution.endpoint.actionsConsole.history"
            defaultMessage="Actions History"
          />
        </h4>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiBasicTable
        items={items}
        columns={columns}
        itemId="id"
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        isExpandable={true}
      />
    </>
  );
};
EndpointActionsConsoleHistory.displayName = 'EndpointActionsConsoleHistory';

function getTableItems(
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>,
  endpointId?: string
) {
  const items = [];

  for (const host of actionsConsoleData.hosts) {
    if (endpointId === undefined || host.id === endpointId) {
      for (const item of host.actionsTimeline) {
        items.push({ ...item, endpoint: host.id });
      }
    }
  }
  return items;
}
