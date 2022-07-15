import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAlertFindingEntity } from './converter';
import { getAlertFindingKey } from './converter';
import { createAPIClient } from '../../client';
import {
  LaceworkApplication,
  LaceworkEvent,
  LaceworkMachine,
} from '../../types';

export async function fetchEvents({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const processEvents: LaceworkEvent[] = [];
  const machineEvents: LaceworkEvent[] = [];

  await apiClient.iterateEvents((alertFinding) => {
    if (alertFinding.srcType === 'Machine') {
      machineEvents.push(alertFinding);
    } else if (
      alertFinding.srcType === 'Process' &&
      alertFinding.srcEvent.exe_path
    ) {
      processEvents.push(alertFinding);
    }
  });

  await jobState.iterateEntities(
    {
      _type: Entities.APPLICATION._type,
    },
    async (applicationEntity) => {
      const application = getRawData<LaceworkApplication>(applicationEntity);
      if (!application) {
        logger.warn(
          { _key: applicationEntity._key },
          'Could not get raw data for application entity',
        );
        return;
      }

      const targetEvent = processEvents.find(
        (alert) => alert.srcEvent.exe_path === application.exePath,
      );
      if (targetEvent) {
        const hasAlertFinding = await jobState.hasKey(
          getAlertFindingKey(targetEvent.eventType, targetEvent.id),
        );

        if (!hasAlertFinding) {
          const alertFindingEntity = await jobState.addEntity(
            createAlertFindingEntity(targetEvent),
          );
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: applicationEntity,
              to: alertFindingEntity,
            }),
          );
        }
      }
    },
  );

  await jobState.iterateEntities(
    {
      _type: Entities.MACHINE._type,
    },
    async (machineEntity) => {
      const machine = getRawData<LaceworkMachine>(machineEntity);
      if (!machine) {
        logger.warn(
          { _key: machineEntity._key },
          'Could not get raw data for machine entity',
        );
        return;
      }

      const targetEvent = machineEvents.find(
        (alert) => parseInt(alert.srcEvent.mid, 10) === machine.mid,
      );
      if (targetEvent) {
        const hasAlertFinding = await jobState.hasKey(
          getAlertFindingKey(targetEvent.eventType, targetEvent.id),
        );

        if (!hasAlertFinding) {
          const alertFindingEntity = await jobState.addEntity(
            createAlertFindingEntity(targetEvent),
          );
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: machineEntity,
              to: alertFindingEntity,
            }),
          );
        }
      }
    },
  );
}

export const eventsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ALERT_FINDINGS.id,
    name: Steps.ALERT_FINDINGS.name,
    entities: [Entities.ALERT_FINDING],
    relationships: [
      Relationships.APPLICATION_HAS_ALERT_FINDING,
      Relationships.MACHINE_HAS_ALERT_FINDING,
    ],
    dependsOn: [Steps.APPLICATIONS.id, Steps.MACHINES.id],
    executionHandler: fetchEvents,
  },
];
