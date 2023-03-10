import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkCloudAccount } from '../../types';

export function getCloudAccountKey(id: string): string {
  return `lacework_cloud_account:${id}`;
}

export function createCloudAccountEntity(
  cloudAccount: LaceworkCloudAccount,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: cloudAccount,
      assign: {
        _key: getCloudAccountKey(cloudAccount.intgGuid),
        _type: Entities.CLOUD_ACCOUNT._type,
        _class: Entities.CLOUD_ACCOUNT._class,

        name: `${cloudAccount.name}-${cloudAccount.type}`,
        type: cloudAccount.type,
        externalId: cloudAccount.data.crossAccountCredentials?.externalId,
        roleArn: cloudAccount.data.crossAccountCredentials?.roleArn,
        clientId: cloudAccount.data.credentials?.clientId,
        clientSecret: cloudAccount.data.credentials?.clientSecret,
      },
    },
  });
}
