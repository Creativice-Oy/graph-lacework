import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getOrganizationKey(name: string): string {
  const formattedName = name.replace(' ', '_');
  return `datastax_organization:${formattedName}`;
}

export function createOrganizationEntity(organization: {
  name: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _key: getOrganizationKey(organization.name),
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        name: organization.name,
      },
    },
  });
}
