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
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { EndpointActionsConsoleData } from '../../../../types';
import { ImmutableObject } from '../../../../../../../../common/endpoint/types';

export const EndpointActionsConsoleHistory = ({
  actionsConsoleData,
}: {
  actionsConsoleData: ImmutableObject<EndpointActionsConsoleData>;
}) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  if (actionsConsoleData === undefined) {
    // TODO show loading
    return <></>;
  }

  console.log(actionsConsoleData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleDetails = (item: any) => {
    console.log(item);
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
      field: 'name',
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
        let color = '';
        switch (status) {
          case 'failed':
            color = 'danger';
          case 'done':
            color = 'success';
        }
        return <EuiHealth color={color}>{status}</EuiHealth>;
      },
    },
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      // eslint-disable-next-line react/display-name
      render: (item) =>
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
  const items = actionsConsoleData.actionsTimeline.map((item) => {
    return {
      startDate: item.startDate,
      endDate: item.endDate,
      name: item.action,
      response: item.response,
      status: item.status,
      id: item.id,
    };
  });
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
