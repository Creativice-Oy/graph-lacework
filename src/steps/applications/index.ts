import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  ORGANIZATION_ENTITY_DATA_KEY,
  Relationships,
} from '../constants';
import { createApplicationEntity } from './converter';
import { getApplicationKey } from './converter';
import { createAPIClient } from '../../client';

export async function fetchApplications({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_DATA_KEY,
  )) as Entity;

  await apiClient.iterateApplications(async (application) => {
    const hasApplication = await jobState.hasKey(
      getApplicationKey(application.exePath),
    );

    if (!hasApplication) {
      const applicationEntity = await jobState.addEntity(
        createApplicationEntity(application),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: organizationEntity,
          to: applicationEntity,
        }),
      );
    }
  });
}

export const applicationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.APPLICATIONS.id,
    name: Steps.APPLICATIONS.name,
    entities: [Entities.APPLICATION],
    relationships: [Relationships.ORGANIZATION_HAS_APPLICATION],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchApplications,
  },
];
