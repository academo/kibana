/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { EuiFlyoutBody, EuiFlyoutFooter, EuiLoadingContent, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { getEndpointDetailsPath } from '../../../management/common/routing';
import {
  uiQueryParams,
  getActivityLogData,
  detailsData,
  detailsError,
  policyVersionInfo,
  hostStatusInfo,
  showView,
} from '../../../management/pages/endpoint_hosts/store/selectors';
import { ActionsMenu } from '../../../management/pages/endpoint_hosts/view/details/components/actions_menu';
import {
  EndpointDetailsTabsTypes,
  EndpointDetailsFlyoutTabs,
} from '../../../management/pages/endpoint_hosts/view/details/components/endpoint_details_tabs';
import { EndpointIsolationFlyoutPanel } from '../../../management/pages/endpoint_hosts/view/details/components/endpoint_isolate_flyout_panel';
import { EndpointDetailsFlyoutHeader } from '../../../management/pages/endpoint_hosts/view/details/components/flyout_header';
import { EndpointActivityLog } from '../../../management/pages/endpoint_hosts/view/details/endpoint_activity_log';
import { EndpointDetailsContent } from '../../../management/pages/endpoint_hosts/view/details/endpoint_details_content';
import { useEndpointSelector } from '../../../management/pages/endpoint_hosts/view/hooks';

// TODO move this translations to this component folder
import * as i18 from '../../../management/pages/endpoint_hosts/view/translations';
import { useToasts } from '../../lib/kibana';
import { PolicyResponseFlyoutPanel } from './policy_response_flyout';

export const EndpointDetails = memo(() => {
  const toasts = useToasts();
  const queryParams = useEndpointSelector(uiQueryParams);

  const activityLog = useEndpointSelector(getActivityLogData);
  const hostDetails = useEndpointSelector(detailsData);
  const hostDetailsError = useEndpointSelector(detailsError);

  const policyInfo = useEndpointSelector(policyVersionInfo);
  const hostStatus = useEndpointSelector(hostStatusInfo);
  const show = useEndpointSelector(showView);

  const ContentLoadingMarkup = useMemo(
    () => (
      <>
        <EuiLoadingContent lines={3} />
        <EuiSpacer size="l" />
        <EuiLoadingContent lines={3} />
      </>
    ),
    []
  );

  const getTabs = useCallback(
    (id: string) => [
      {
        id: EndpointDetailsTabsTypes.overview,
        name: i18.OVERVIEW,
        route: getEndpointDetailsPath({
          ...queryParams,
          name: 'endpointDetails',
          selected_endpoint: id,
        }),
        content:
          hostDetails === undefined ? (
            ContentLoadingMarkup
          ) : (
            <EndpointDetailsContent
              details={hostDetails}
              policyInfo={policyInfo}
              hostStatus={hostStatus}
            />
          ),
      },
      {
        id: EndpointDetailsTabsTypes.activityLog,
        name: i18.ACTIVITY_LOG.tabTitle,
        route: getEndpointDetailsPath({
          ...queryParams,
          name: 'endpointActivityLog',
          selected_endpoint: id,
        }),
        content: <EndpointActivityLog activityLog={activityLog} />,
      },
    ],
    [ContentLoadingMarkup, hostDetails, policyInfo, hostStatus, activityLog, queryParams]
  );

  const showFlyoutFooter =
    show === 'details' || show === 'policy_response' || show === 'activity_log';

  useEffect(() => {
    if (hostDetailsError !== undefined) {
      toasts.addDanger({
        title: i18n.translate('xpack.securitySolution.endpoint.details.errorTitle', {
          defaultMessage: 'Could not find host',
        }),
        text: i18n.translate('xpack.securitySolution.endpoint.details.errorBody', {
          defaultMessage: 'Please exit the flyout and select an available host.',
        }),
      });
    }
  }, [hostDetailsError, show, toasts]);
  return (
    <>
      {(show === 'policy_response' || show === 'isolate' || show === 'unisolate') && (
        <EndpointDetailsFlyoutHeader hostname={hostDetails?.host?.hostname} />
      )}
      {hostDetails === undefined ? (
        <EuiFlyoutBody>
          <EuiLoadingContent lines={3} /> <EuiSpacer size="l" /> <EuiLoadingContent lines={3} />
        </EuiFlyoutBody>
      ) : (
        <>
          {(show === 'details' || show === 'activity_log') && (
            <EndpointDetailsFlyoutTabs
              hostname={hostDetails.host.hostname}
              show={show}
              tabs={getTabs(hostDetails.agent.id)}
            />
          )}

          {show === 'policy_response' && <PolicyResponseFlyoutPanel hostMeta={hostDetails} />}

          {(show === 'isolate' || show === 'unisolate') && (
            <EndpointIsolationFlyoutPanel hostMeta={hostDetails} />
          )}

          {showFlyoutFooter && (
            <EuiFlyoutFooter className="eui-textRight" data-test-subj="endpointDetailsFlyoutFooter">
              <ActionsMenu />
            </EuiFlyoutFooter>
          )}
        </>
      )}
    </>
  );
});

EndpointDetails.displayName = 'EndpointDetails';
