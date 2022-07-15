import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, ORGANIZATION_ENTITY_DATA_KEY } from '../constants';
import { createOrganizationEntity } from './converter';

export async function fetchOrganizationDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const organizationEntity = await jobState.addEntity(
    createOrganizationEntity({
      name: instance.config.organizationUrl,
    }),
  );
  await jobState.setData(ORGANIZATION_ENTITY_DATA_KEY, organizationEntity);
}

export const organizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATION,
    name: 'Fetch Organization Details',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOrganizationDetails,
  },
];
