import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-organization',
    name: 'Fetch Organization Details',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'lacework_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
