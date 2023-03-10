import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const serviceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Entities
     */
    id: 'fetch-service',
    name: 'Fetch Service',
    entities: [
      {
        resourceName: 'Service',
        _type: 'lacework_service',
        _class: ['Service'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_organization_has_service',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_service',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
