import {
  createIntegrationEntity,
  Entity,
  Relationship,
  createMappedRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities, MappedRelationships } from '../constants';
import {
  LaceworkAWSEntity,
  LaceworkRecommendation,
  LaceworkAzureEntity,
} from '../../types';

export function getFindingKey(subscriptionId: string, url: string): string {
  return `lacework_finding:${subscriptionId}_${url}`;
}

export function getAWSEntityKey(name: string) {
  return `lacework_aws_entity:${name}`;
}

export function getAzureEntityKey(name: string) {
  return `lacework_azure_entity:${name}`;
}

export function createFindingEntity(
  reccomendation: LaceworkRecommendation,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: reccomendation,
      assign: {
        _key: getFindingKey(
          reccomendation.ACCOUNT_ID || reccomendation.SUBSCRIPTION_ID,
          reccomendation.INFO_LINK,
        ),
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,

        name: reccomendation.TITLE,
        webLink: reccomendation.INFO_LINK,
        category: reccomendation.CATEGORY,
        severity: 'n/a',
        numericSeverity: reccomendation.SEVERITY,
        open: true,
      },
    },
  });
}

export function createAWSEntity(entity: LaceworkAWSEntity): Entity {
  return createIntegrationEntity({
    entityData: {
      source: entity,
      assign: {
        _key: getAWSEntityKey(entity.arn),
        _type: Entities.AWS_ENTITY._type,
        _class: Entities.AWS_ENTITY._class,

        name: entity.arn,
        displayName: entity.arn,
      },
    },
  });
}

export function createAzureEntity(entity: LaceworkAzureEntity): Entity {
  return createIntegrationEntity({
    entityData: {
      source: entity,
      assign: {
        _key: getAzureEntityKey(entity.urn),
        _type: Entities.AZURE_ENTITY._type,
        _class: Entities.AZURE_ENTITY._class,

        name: entity.urn,
        displayName: entity.urn,
      },
    },
  });
}

export function createLaceworkAWSEntityToAWSEntityRelationship(
  awsEntity: Entity,
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.LACEWORK_AWS_ENTITY_IS_AWS_ENTITY._type,
    _mapping: {
      sourceEntityKey: awsEntity._key,
      relationshipDirection:
        MappedRelationships.LACEWORK_AWS_ENTITY_IS_AWS_ENTITY.direction,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _class: 'Entity',
        _type: 'aws_entity',
        _key: awsEntity._key.toLowerCase(),
        displayName: awsEntity.displayName,
      },
      skipTargetCreation: true,
    },
  });
}

export function createLaceworkAzureEntityToAzureEntityRelationship(
  azureEntity: Entity,
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.LACEWORK_AZURE_ENTITY_IS_AZURE_ENTITY._type,
    _mapping: {
      sourceEntityKey: azureEntity._key,
      relationshipDirection:
        MappedRelationships.LACEWORK_AZURE_ENTITY_IS_AZURE_ENTITY.direction,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _class: 'Entity',
        _type: 'azure_entity',
        _key: azureEntity._key.toLowerCase(),
        displayName: azureEntity.displayName,
      },
      skipTargetCreation: true,
    },
  });
}
