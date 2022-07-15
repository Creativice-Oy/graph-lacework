import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getServiceKey(name: string): string {
  return `lacework_service:${name}`;
}

export function createServiceEntity(service: { name: string }): Entity {
  return createIntegrationEntity({
    entityData: {
      source: service,
      assign: {
        _key: getServiceKey(service.name),
        _type: Entities.SERVICE._type,
        _class: Entities.SERVICE._class,
        name: service.name,
        displayName: service.name,
        category: ['software', 'other'],
        function: ['scanner'],
      },
    },
  });
}
