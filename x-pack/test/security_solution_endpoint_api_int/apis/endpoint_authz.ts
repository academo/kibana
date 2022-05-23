/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { wrapErrorAndRejectPromise } from '@kbn/security-solution-plugin/common/endpoint/data_loaders/utils';
import { FtrProviderContext } from '../ftr_provider_context';
import {
  createUserAndRole,
  deleteUserAndRole,
  ROLES,
} from '../../common/services/security_solution';

export default function ({ getService }: FtrProviderContext) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');

  describe('When attempting to call an endpoint api with no authz', () => {
    before(async () => {
      // create role/user
      await createUserAndRole(getService, ROLES.t1_analyst);
    });

    after(async () => {
      // delete role/user
      await deleteUserAndRole(getService, ROLES.t1_analyst);
    });

    const apiList = [
      {
        method: 'get',
        path: '/api/endpoint/metadata',
        body: undefined,
      },
      {
        method: 'get',
        path: '/api/endpoint/action_status?agent_ids=1',
        body: undefined,
      },
      {
        method: 'get',
        path: '/api/endpoint/policy/summaries?package_name=endpoint',
        body: undefined,
      },
      {
        method: 'get',
        path: '/api/endpoint/action_log/one?start_date=2021-12-01&end_date=2021-12-04',
        body: undefined,
      },
      {
        method: 'get',
        path: '/api/endpoint/policy_response?agentId=1',
        body: undefined,
      },
      {
        method: 'post',
        path: '/api/endpoint/isolate',
        body: { endpoint_ids: ['one'] },
      },
      {
        method: 'post',
        path: '/api/endpoint/unisolate',
        body: { endpoint_ids: ['one'] },
      },
    ];

    for (const apiListItem of apiList) {
      it(`should return 403 when [${apiListItem.method.toUpperCase()} ${
        apiListItem.path
      }]`, async () => {
        await supertestWithoutAuth[apiListItem.method](apiListItem.path)
          .auth(ROLES.t1_analyst, 'changeme')
          .set('kbn-xsrf', 'xxx')
          .send(apiListItem.body)
          .expect(403, {
            statusCode: 403,
            error: 'Forbidden',
            message: 'Endpoint authorization failure',
          })
          .catch(wrapErrorAndRejectPromise);
      });
    }
  });
}
