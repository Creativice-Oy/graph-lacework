import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createCloudAccountEntity } from './converter';

export const ORGANIZATION_ENTITY_KEY = 'entity:organization';

export async function fetchCloudAccounts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateCloudAccounts(async (cloudAccount) => {
    await jobState.addEntity(createCloudAccountEntity(cloudAccount));
  });
}

export const cloudAccountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNTS.id,
    name: Steps.ACCOUNTS.name,
    entities: [Entities.CLOUD_ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchCloudAccounts,
  },
];
