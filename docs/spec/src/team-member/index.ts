import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const teamMemberSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://lwintjupiterone.lacework.net/api/v2/TeamMembers
     * PATTERN: Fetch Entities
     */
    id: 'fetch-team-members',
    name: 'Fetch Team Members',
    entities: [
      {
        resourceName: 'Team Member',
        _type: 'lacework_team_member',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_organization_has_team_member',
        sourceType: 'lacework_organization',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_team_member',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
];
