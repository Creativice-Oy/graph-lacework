import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  ORGANIZATION_ENTITY_DATA_KEY,
  Relationships,
} from '../constants';
import { createCloudAccountEntity } from './converter';

export const ORGANIZATION_ENTITY_KEY = 'entity:organization';

export async function fetchCloudAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_DATA_KEY,
  )) as Entity;

  await apiClient.iterateCloudAccounts(async (cloudAccount) => {
    if (cloudAccount.name === 'Test') {
      const cloudAccountEntity = await jobState.addEntity(
        createCloudAccountEntity(cloudAccount),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: organizationEntity,
          to: cloudAccountEntity,
        }),
      );
    }
  });
}

export const cloudAccountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNTS.id,
    name: Steps.ACCOUNTS.name,
    entities: [Entities.CLOUD_ACCOUNT],
    relationships: [Relationships.ORGANIZATION_HAS_CLOUD_ACCOUNT],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchCloudAccounts,
  },
];
