import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkMachine } from '../../types';

export function getMachineKey(hostname: string): string {
  return `lacework_machine:${hostname}`;
}

export function createMachineEntity(machine: LaceworkMachine): Entity {
  //console.log(machine.hostname)
  return createIntegrationEntity({
    entityData: {
      source: machine,
      assign: {
        _key: getMachineKey(machine.hostname),
        _type: Entities.MACHINE._type,
        _class: Entities.MACHINE._class,

        name: machine.hostname || 'default',
        hostname: machine.hostname,
      },
    },
  });
}
