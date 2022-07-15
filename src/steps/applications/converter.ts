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
        exePath: application.exePath,
        mid: application.mid,
        'containerInfo.vmType': application.containerInfo.vm_type,
        'propsMachine.hostname': application.propsMachine.hostname,
        'propsMachine.ipAddr': application.propsMachine.ip_addr,
        'propsMachine.memKbytes': application.propsMachine.mem_kbytes,
        'propsMachine.numUsers': application.propsMachine.num_users,
        'propsMachine.primaryTags': application.propsMachine.primary_tags,
        'propsMachine.tags.externalIp':
          application.propsMachine.tags?.ExternalIp,
        'propsMachine.tags.hostname': application.propsMachine.tags?.Hostname,
        'propsMachine.tags.instanceId':
          application.propsMachine.tags?.InstanceId,
        'propsMachine.tags.instanceName':
          application.propsMachine.tags?.InstanceName,
        'propsMachine.tags.internalIp':
          application.propsMachine.tags?.InternalIp,
        'propsMachine.tags.numericProjectId':
          application.propsMachine.tags?.NumericProjectId,
        'propsMachine.tags.projectId': application.propsMachine.tags?.ProjectId,
        'propsMachine.tags.vmInstanceType':
          application.propsMachine.tags?.VmInstanceType,
        'propsMachine.tags.vmProvider':
          application.propsMachine.tags?.VmProvider,
        'propsMachine.tags.zone': application.propsMachine.tags?.Zone,
        'propsMachine.tags.arch': application.propsMachine.tags?.arch,
        'propsMachine.tags.os': application.propsMachine.tags?.os,
        'propsMachine.upTime': application.propsMachine.up_time,
        startedOn: parseTimePropertyValue(application.startTime),
        endedOn: parseTimePropertyValue(application.endTime),
        'username.effective': application.username.effective,
        'username.original': application.username.original,
      },
    },
  });
}
