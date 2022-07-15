import { StepSpec, RelationshipClass } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const cloudAccountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL/api/v2/CloudAccounts
     * PATTERN: Fetch  Entities
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
    relationships: [
      {
        _type: 'lacework_organization_has_cloud_account',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_cloud_account',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
