/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { HostInfo, HostMetadata, HostStatus } from '../../../../../../common/endpoint/types';
import { uiQueryParams } from '../../store/selectors';
import { useEndpointSelector } from '../hooks';

export const EndpointActionsConsole = ({
  details,
  policyInfo,
  hostStatus,
}: {
  details: HostMetadata;
  policyInfo?: HostInfo['policy_info'];
  hostStatus: HostStatus;
}) => {
  return <b>{'Console here'}</b>;
};
EndpointActionsConsole.displayName = 'EndpointActionsConsole';
