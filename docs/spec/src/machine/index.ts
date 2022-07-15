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
    relationships: [
      {
        _type: 'lacework_organization_has_machine',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_machine',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Build Child Relationships
     */
    id: 'build-machine-application-relationships',
    name: 'Build Machine and Application Relationship',
    entities: [],
    relationships: [
      {
        _type: 'lacework_machine_has_application',
        sourceType: 'lacework_machine',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_application',
      },
    ],
    dependsOn: ['fetch-applications', 'fetch-machines'],
    implemented: true,
  },
];
