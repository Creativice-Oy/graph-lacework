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
        'machineTags.externalIp': machine.machineTags?.ExternalIp,
        'machineTags.hostname': machine.machineTags?.Hostname,
        'machineTags.instanceId': machine.machineTags?.InstanceId,
        'machineTags.instanceName': machine.machineTags?.InstanceName,
        'machineTags.internalIp': machine.machineTags?.InternalIp,
        'machineTags.numericProjectId': machine.machineTags?.NumericProjectId,
        'machineTags.ProjectId': machine.machineTags?.ProjectId,
        'machineTags.VmInstanceType': machine.machineTags?.VmInstanceType,
        'machineTags.VmProvider': machine.machineTags?.VmProvider,
        'machineTags.Zone': machine.machineTags?.Zone,
        'machineTags.arch': machine.machineTags?.arch,
        'machineTags.os': machine.machineTags?.os,
        mid: machine.mid,
        primaryIpAddress: machine.primaryIpAddr,
        startedOn: parseTimePropertyValue(machine.startTime),
      },
    },
  });
}
