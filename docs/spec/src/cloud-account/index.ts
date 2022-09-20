import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const cloudAccountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL/api/v2/CloudAccounts
     * PATTERN: Singleton
     */
    id: 'fetch-cloud-accounts',
    name: 'Fetch Cloud Accounts',
    entities: [
      {
        resourceName: 'Cloud Account',
        _type: 'lacework_cloud_account',
        _class: ['Account'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
