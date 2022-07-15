import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkPackage } from '../../types';

export function getPackageKey(
  packageName: string,
  version: string,
  arch: string,
): string {
  return `lacework_package:${packageName}:${arch}:${version}`;
}

export function createPackageEntity(laceworkPackage: LaceworkPackage): Entity {
  return createIntegrationEntity({
    entityData: {
      source: laceworkPackage,
      assign: {
        _key: getPackageKey(
          laceworkPackage.packageName,
          laceworkPackage.arch,
          laceworkPackage.version,
        ),
        _type: Entities.PACKAGE._type,
        _class: Entities.PACKAGE._class,
        displayName: laceworkPackage.packageName,
        name: laceworkPackage.packageName,
        createdOn: parseTimePropertyValue(laceworkPackage.createdTime),
        mid: laceworkPackage.mid,
        packageName: laceworkPackage.packageName,
        version: laceworkPackage.version,
        arch: laceworkPackage.arch,
      },
    },
  });
}
