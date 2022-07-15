import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Entities,
  ORGANIZATION_ENTITY_DATA_KEY,
  Relationships,
  SERVICE_ENTITY_DATA_KEY,
  Steps,
} from '../constants';

import { createServiceEntity } from './converter';

export async function fetchServiceDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_DATA_KEY,
  )) as Entity;

  const service = {
    name: 'Lacework Scanner',
  };

  const serviceEntity = createServiceEntity(service);

  await Promise.all([
    jobState.addEntity(serviceEntity),
    jobState.setData(SERVICE_ENTITY_DATA_KEY, serviceEntity),
    jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: organizationEntity,
        to: serviceEntity,
      }),
    ),
  ]);
}

export const serviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SERVICE.id,
    name: Steps.SERVICE.name,
    entities: [Entities.SERVICE],
    relationships: [Relationships.ORGANIZATION_HAS_SERVICE],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchServiceDetails,
  },
];
