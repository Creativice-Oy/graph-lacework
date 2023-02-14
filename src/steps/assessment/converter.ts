import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { LaceworkAssessment } from '../../types';

export function getAssessmentKey(
  name: string,
  id: string,
  time: string,
): string {
  const formattedName = name.replace(' ', '_');
  return `lacework_assessment:${formattedName}_${id}_${time}`;
}

export function createAssessmentEntity(
  assessment: LaceworkAssessment,
  cloudAccountID: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: assessment,
      assign: {
        _key: getAssessmentKey(
          assessment.reportType,
          cloudAccountID,
          assessment.reportTime,
        ),
        _type: Entities.ASSESSMENT._type,
        _class: Entities.ASSESSMENT._class,
        category: 'Compliance Assessment',
        summary: assessment.reportTitle,
        internal: true,
        name: `${assessment.reportType}-${assessment.accountId}`,
        completedOn: parseTimePropertyValue(assessment.reportTime),
      },
    },
  });
}
