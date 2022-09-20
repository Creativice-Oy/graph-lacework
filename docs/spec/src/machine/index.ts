import { StepSpec, RelationshipClass } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const machineSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL/api/v2/Entities/Machines/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-machines',
    name: 'Fetch Machines',
    entities: [
      {
        resourceName: 'Machine',
        _type: 'lacework_machine',
        _class: ['Host'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
