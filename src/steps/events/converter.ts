import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkEvent } from '../../types';

export function getAlertFindingKey(eventType: string, id: string): string {
  return `lacework_alert_finding:${eventType}:${id}`;
}

export function createAlertFindingEntity(event: LaceworkEvent): Entity {
  return createIntegrationEntity({
    entityData: {
      source: event,
      assign: {
        _key: getAlertFindingKey(event.eventType, event.id),
        _type: Entities.ALERT_FINDING._type,
        _class: Entities.ALERT_FINDING._class,
        name: event.id.toString(),
        displayName: event.id.toString(),
        dstType: event.dstType,
        srcType: event.srcType,
        startedOn: parseTimePropertyValue(event.startTime),
        endedOn: parseTimePropertyValue(event.endTime),
        eventCount: event.eventCount,
        eventType: event.eventType,
      },
    },
  });
}
