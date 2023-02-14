import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkTeamMember } from '../../types';

export function getTeamMemberKey(userGuid: string) {
  return `datastax_access_list:${userGuid}`;
}

function getShortLoginId(email: string) {
  return email.split('@')[0];
}

function getEmailDomail(email: string) {
  return email.split('@')[1];
}

export function createTeamMemberEntity(teamMember: LaceworkTeamMember): Entity {
  return createIntegrationEntity({
    entityData: {
      source: teamMember,
      assign: {
        _type: Entities.TEAM_MEMBER._type,
        _class: Entities.TEAM_MEMBER._class,
        _key: getTeamMemberKey(teamMember.userGuid),
        id: teamMember.userGuid,
        name: `${teamMember.props.firstName} ${teamMember.props.lastName}`,
        username: teamMember.userName,
        email: teamMember.userName,
        emailDomain: [getEmailDomail(teamMember.userName)],
        shortLoginId: getShortLoginId(teamMember.userName),
        active: teamMember.userEnabled == 1 ? true : false,
        company: teamMember.props.company,
        jitCreated: teamMember.props.jitCreated,
        accountAdmin: teamMember.props.accountAdmin,
        orgAdmin: teamMember.props.orgAdmin,
        orgUser: teamMember.props.orgUser,
        createdAt: parseTimePropertyValue(teamMember.props.createdTime),
      },
    },
  });
}

export function createOrganizationTeamMemberRelationship(
  organization: Entity,
  teamMember: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: organization,
    to: teamMember,
  });
}
