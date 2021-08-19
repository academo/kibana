/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { AdministrationListPage } from '../../../components/administration_list_page';
import { EndpointList } from './';
import { EndpointActionsConsole } from './details/endpoint_actions_console';
export const TabbedEndpointList = () => {
  const tabs = [
    {
      id: 'endpoints',
      name: 'Endpoints List',
      content: (
        <>
          <EuiSpacer size="m" />
          <EndpointList />
        </>
      ),
    },
    {
      id: 'console_actions',
      name: 'Console Actions',
      content: (
        <>
          <EuiSpacer size="m" />
          <EndpointActionsConsole />
        </>
      ),
    },
  ];
  return (
    <AdministrationListPage
      data-test-subj="endpointPage"
      title={
        <FormattedMessage
          id="xpack.securitySolution.endpoint.list.pageTitle"
          defaultMessage="Endpoints"
        />
      }
      subtitle={
        <FormattedMessage
          id="xpack.securitySolution.endpoint.list.pageSubTitle"
          defaultMessage="Hosts running endpoint security"
        />
      }
    >
      <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[1]} autoFocus="selected" />
    </AdministrationListPage>
  );
};
