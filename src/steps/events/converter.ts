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
        'dstEvent.exePath': event.dstEvent.exe_path,
        'dstEvent.hostname': event.dstEvent.hostname,
        'dstEvent.isVuln': event.dstEvent.isVuln,
        'dstEvent.mid': event.dstEvent.mid,
        'dstEvent.severity': event.dstEvent.severity,
        'dstEvent.username': event.dstEvent.username,
        'dstEvent.vulnDetails': event.dstEvent.vulnDetails,
        srcType: event.srcType,
        'srcEvent.exePath': event.srcEvent.exe_path,
        'srcEvent.hostname': event.srcEvent.hostname,
        'srcEvent.isVuln': event.srcEvent.isVuln,
        'srcEvent.mid': event.srcEvent.mid,
        'srcEvent.severity': event.srcEvent.severity,
        'srcEvent.username': event.srcEvent.username,
        'srcEvent.vulnDetails': event.srcEvent.vulnDetails,
        startedOn: parseTimePropertyValue(event.startTime),
        endedOn: parseTimePropertyValue(event.endTime),
        eventCount: event.eventCount,
        eventType: event.eventType,
      },
    },
  });
}
