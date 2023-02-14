import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkMachine } from '../../types';

export function getMachineKey(mid: number): string {
  return `lacework_machine:${mid}`;
}

export function createMachineEntity(machine: LaceworkMachine): Entity {
  return createIntegrationEntity({
    entityData: {
      source: machine,
      assign: {
        _key: getMachineKey(machine.mid),
        _type: Entities.MACHINE._type,
        _class: Entities.MACHINE._class,
        name: machine.hostname || 'default',
        hostname: machine.hostname,
        ipAddress: machine.primaryIpAddr,
        osName: machine.hostname,
        publicIpAddress:
          machine.machineTags?.ExternalIp !== 'NOT_AVAILABLE'
            ? machine.machineTags?.ExternalIp
            : undefined,
        privateIpAddress:
          machine.machineTags?.InternalIp !== 'NOT_AVAILABLE'
            ? machine.machineTags?.InternalIp
            : undefined,
        mid: machine.mid,
        startedOn: parseTimePropertyValue(machine.startTime),
      },
    },
  });
}
