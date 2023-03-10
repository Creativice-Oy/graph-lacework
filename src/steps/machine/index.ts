import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  ORGANIZATION_ENTITY_DATA_KEY,
  Relationships,
} from '../constants';
import { createMachineEntity } from './converter';
import { getMachineKey } from './converter';
import { createAPIClient } from '../../client';
import { LaceworkApplication } from '../../types';

export async function fetchMachines({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_DATA_KEY,
  )) as Entity;

  await apiClient.iterateMachines(async (machine) => {
    const hasMachine = await jobState.hasKey(getMachineKey(machine.mid));

    if (!hasMachine) {
      const machineEntity = await jobState.addEntity(
        createMachineEntity(machine),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: organizationEntity,
          to: machineEntity,
        }),
      );
    }
  });
}

export async function buildMachineAndApplicationRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.APPLICATION._type },
    async (applicationEntity) => {
      const application = getRawData<LaceworkApplication>(applicationEntity);
      if (!application) {
        logger.warn(
          { _key: applicationEntity._key },
          'Could not get raw data for application entity',
        );
        return;
      }

      const machineEntity = (await jobState.findEntity(
        getMachineKey(parseInt(application.mid, 10)),
      )) as Entity;

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: machineEntity,
          to: applicationEntity,
        }),
      );
    },
  );
}

export const machineSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.MACHINES.id,
    name: Steps.MACHINES.name,
    entities: [Entities.MACHINE],
    relationships: [Relationships.ORGANIZATION_HAS_MACHINE],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchMachines,
  },
  {
    id: Steps.MACHINE_APPLICATION_RELATIONSHIP.id,
    name: Steps.MACHINE_APPLICATION_RELATIONSHIP.name,
    entities: [],
    relationships: [Relationships.MACHINE_HAS_APPLICATION],
    dependsOn: [Steps.APPLICATIONS.id, Steps.MACHINES.id],
    executionHandler: buildMachineAndApplicationRelationships,
  },
];
