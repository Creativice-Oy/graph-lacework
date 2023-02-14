import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkApplication } from '../../types';

export function getApplicationKey(exePath: string): string {
  return `lacework_application:${exePath}`;
}

export function createApplicationEntity(
  application: LaceworkApplication,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: application,
      assign: {
        _key: getApplicationKey(application.exePath),
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        name: application.appName,
        displayName: application.appName,
        executablePath: application.exePath,
        mid: application.mid,
        startedOn: parseTimePropertyValue(application.startTime),
        endedOn: parseTimePropertyValue(application.endTime),
      },
    },
  });
}
