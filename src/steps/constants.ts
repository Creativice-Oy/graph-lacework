import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ORGANIZATION: 'fetch-organization',
  TEAM_MEMBERS: 'fetch-team-members',
};

export const Entities: Record<
  | 'ORGANIZATION'
  | 'TEAM_MEMBER',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'lacework_organization',
    _class: ['Organization'],
  },
  TEAM_MEMBER: {
    resourceName: 'Team Member',
    _type: 'lacework_team_member',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_TEAM_MEMBER',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_TEAM_MEMBER: {
    _type: 'lacework_organization_has_team_member',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM_MEMBER._type,
  },
};
