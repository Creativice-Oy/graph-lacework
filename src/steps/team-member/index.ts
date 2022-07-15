import {
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps, Relationships } from '../constants';
import { ORGANIZATION_ENTITY_KEY } from '../organization';
import {
  createTeamMemberEntity,
  createOrganizationTeamMemberRelationship,
} from './converter';

export async function fetchTeamMembers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_KEY,
  )) as Entity;

  await apiClient.iterateTeamMembers(async (teamMember) => {
    const teamMemberEntity = await jobState.addEntity(
      createTeamMemberEntity(teamMember),
    );

    await jobState.addRelationship(
      createOrganizationTeamMemberRelationship(
        organizationEntity,
        teamMemberEntity,
      ),
    );
  });
}

export const accessListSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TEAM_MEMBERS,
    name: 'Fetch Team Members',
    entities: [Entities.TEAM_MEMBER],
    relationships: [
      Relationships.ORGANIZATION_HAS_TEAM_MEMBER,
    ],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchTeamMembers,
  },
];
