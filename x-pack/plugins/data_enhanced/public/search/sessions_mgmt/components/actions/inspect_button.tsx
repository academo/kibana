/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlyoutBody, EuiFlyoutHeader, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import React, { Fragment } from 'react';
import { CoreStart } from 'kibana/public';
import { UISession } from '../../types';
import { TableText } from '..';
import {
  CodeEditor,
  createKibanaReactContext,
  toMountPoint,
} from '../../../../../../../../src/plugins/kibana_react/public';
import './inspect_button.scss';
import { OnActionClick } from './types';

interface InspectFlyoutProps {
  searchSession: UISession;
  overlays: CoreStart['overlays'];
  uiSettings: CoreStart['uiSettings'];
  onActionClick: OnActionClick;
}

const InspectFlyout = ({ uiSettings, searchSession }: InspectFlyoutProps) => {
  const { Provider: KibanaReactContextProvider } = createKibanaReactContext({
    uiSettings,
  });

  const renderInfo = () => {
    return (
      <Fragment>
        <CodeEditor
          languageId="json"
          value={JSON.stringify(searchSession.initialState, null, 2)}
          onChange={() => {}}
          options={{
            readOnly: true,
            lineNumbers: 'off',
            fontSize: 12,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
          }}
        />
      </Fragment>
    );
  };

  return (
    <KibanaReactContextProvider>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2 id="flyoutTitle">
            <FormattedMessage
              id="xpack.data.sessions.management.flyoutTitle"
              defaultMessage="Inspect search session"
            />
          </h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody className="searchSessionsFlyout" data-test-subj="searchSessionsFlyout">
        <EuiText>
          <EuiText size="xs">
            <p>
              <FormattedMessage
                id="xpack.data.sessions.management.flyoutText"
                defaultMessage="Configuration for this search session"
              />
            </p>
          </EuiText>
          <EuiSpacer />
          {renderInfo()}
        </EuiText>
      </EuiFlyoutBody>
    </KibanaReactContextProvider>
  );
};
export const InspectButton = (props: InspectFlyoutProps) => {
  const { overlays, onActionClick } = props;

  return (
    <Fragment>
      <TableText
        onClick={() => {
          onActionClick();
          const flyout = <InspectFlyout {...props} />;
          overlays.openFlyout(toMountPoint(flyout));
        }}
      >
        <FormattedMessage
          id="xpack.data.mgmt.searchSessions.flyoutTitle"
          aria-label="Inspect"
          defaultMessage="Inspect"
        />
      </TableText>
    </Fragment>
  );
};
