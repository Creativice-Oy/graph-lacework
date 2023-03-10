import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const applicationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL.lacework.net/api/v2/Entities/Applications/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-applications',
    name: 'Fetch Applications',
    entities: [
      {
        resourceName: 'Application',
        _type: 'lacework_application',
        _class: ['Application'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_organization_has_application',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_application',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
