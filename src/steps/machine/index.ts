import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createMachineEntity } from './converter';
import { getMachineKey } from './converter';
import { createAPIClient } from '../../client';

// iterate over all cloud accounts then over all assessment types
// for that type of cloud account
export async function fetchMachines({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateMachines(async (machine) => {
    const isMachineEntity = await jobState.findEntity(
      getMachineKey(machine.hostname),
    );
    if (!isMachineEntity) {
      await jobState.addEntity(createMachineEntity(machine));
    }
  });
}

export const machineSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.MACHINES.id,
    name: Steps.MACHINES.name,
    entities: [Entities.MACHINE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchMachines,
  },
];
