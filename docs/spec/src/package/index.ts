import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const packageSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://lwintjupiterone.lacework.net/api/v2/Entities/Packages/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-packages',
    name: 'Fetch Packages',
    entities: [
      {
        resourceName: 'Package',
        _type: 'lacework_package',
        _class: ['CodeModule'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_organization_has_package',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_package',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
