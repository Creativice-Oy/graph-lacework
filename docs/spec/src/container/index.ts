import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const containerSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://lwintjupiterone.lacework.net/api/v2/Entities/Containers/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-containers',
    name: 'Fetch Containers',
    entities: [
      {
        resourceName: 'Container',
        _type: 'lacework_container',
        _class: ['Container'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_organization_has_container',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_container',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
