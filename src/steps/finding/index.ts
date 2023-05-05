import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  MappedRelationships,
  Relationships,
} from '../constants';
import {
  createFindingEntity,
  createAWSEntity,
  createAzureEntity,
  createLaceworkAWSEntityToAWSEntityRelationship,
  createLaceworkAzureEntityToAzureEntityRelationship,
  getFindingKey,
  getAWSEntityKey,
  getAzureEntityKey,
} from './converter';
import {
  LaceworkAssessment,
  LaceworkAWSEntity,
  LaceworkRecommendation,
} from '../../types';

//get findings with corresponding csp resource from assessments
export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSESSMENT._type },
    async (assessmentEntity) => {
      const assessment = getRawData<LaceworkAssessment>(assessmentEntity);
      if (!assessment) {
        logger.warn(
          { _key: assessmentEntity._key },
          'Could not get raw data for Assessment entity',
        );
        return;
      }
      //refactor to utilize async iterator
      for (const reccomendation of assessment.data[0].recommendations) {
        if (
          reccomendation.VIOLATIONS &&
          Object.keys(reccomendation.VIOLATIONS).length
        ) {
          let findingEntity;
          const isLaceworkFinding = await jobState.findEntity(
            getFindingKey(
              reccomendation.SUBSCRIPTION_ID || reccomendation.ACCOUNT_ID,
              reccomendation.INFO_LINK,
            ),
          );
          if (!isLaceworkFinding) {
            findingEntity = await jobState.addEntity(
              createFindingEntity(reccomendation),
            );
          } else {
            return;
          }

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.IDENTIFIED,
              from: assessmentEntity,
              to: findingEntity,
            }),
          );
        }
      }
    },
  );
}

//After getting the corresponding resource for a  finding we build an intermediate CSP_entity
//To store some of the details of the entity for possible integration with other J1 services
export async function buildLaceworkAWSEntityFindingRelationship({
  jobState,
  logger,
}): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.FINDING._type },
    async (findingEntity) => {
      const finding = getRawData<LaceworkRecommendation>(findingEntity);

      if (!finding) {
        logger.error(
          `Can not get raw data from finding entity: ${findingEntity._key}`,
        );
      }

      if (finding) {
        for (const violation of finding.VIOLATIONS) {
          let laceworkAWSEntity;
          if (finding.SERVICE.split(':')[0] == 'aws') {
            const islaceworkAWSEntity = await jobState.findEntity(
              getAWSEntityKey(violation.resource || 'default'),
            );
            if (islaceworkAWSEntity) {
              laceworkAWSEntity = islaceworkAWSEntity;
              continue;
            } else {
              laceworkAWSEntity = await jobState.addEntity(
                createAWSEntity({
                  arn: violation.resource || 'default',
                }),
              );
            }

            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: laceworkAWSEntity,
                to: findingEntity,
              }),
            );
          }
        }
      }
    },
  );
}

export async function buildLaceworkAzureEntityFindingRelationship({
  jobState,
  logger,
}): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.FINDING._type },
    async (findingEntity) => {
      const finding = getRawData<LaceworkRecommendation>(findingEntity);

      if (!finding) {
        logger.error(
          `Can not get raw data from finding entity: ${findingEntity._key}`,
        );
      }

      if (finding) {
        for (const violation of finding.VIOLATIONS) {
          let laceworkAzureEntity;
          if (finding.SERVICE.split(':')[0] == 'azure') {
            const islaceworkAzureEntity = await jobState.findEntity(
              getAzureEntityKey(violation.resource || 'default'),
            );
            if (islaceworkAzureEntity) {
              laceworkAzureEntity = islaceworkAzureEntity;
            } else {
              laceworkAzureEntity = await jobState.addEntity(
                createAzureEntity({
                  urn: violation.resource || 'default',
                }),
              );
            }

            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: laceworkAzureEntity,
                to: findingEntity,
              }),
            );
          }
        }
      }
    },
  );
}

export async function buildLaceworkAWSEntityToAWSEntityRelationship({
  jobState,
  logger,
}): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.AWS_ENTITY._type },
    async (awsEntity) => {
      const aws = getRawData<LaceworkAWSEntity>(awsEntity);

      if (!aws)
        logger.error(`Can not get raw data from aws entity: ${awsEntity.id}`);
      await jobState.addRelationship(
        createLaceworkAWSEntityToAWSEntityRelationship(awsEntity),
      );
    },
  );
}

export async function buildLaceworkAzureEntityToAzureEntityRelationship({
  jobState,
  logger,
}): Promise<void> {
  await jobState.iterateEntities(
    { _type: Entities.AZURE_ENTITY._type },
    async (azureEntity) => {
      const aws = getRawData<LaceworkAWSEntity>(azureEntity);

      if (!aws)
        logger.error(`Can not get raw data from aws entity: ${azureEntity.id}`);
      await jobState.addRelationship(
        createLaceworkAzureEntityToAzureEntityRelationship(azureEntity),
      );
    },
  );
}

export const findingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS.id,
    name: Steps.FINDINGS.name,
    entities: [Entities.FINDING],
    relationships: [Relationships.ASSESSMENT_IDENFIED_FINDING],
    dependsOn: [Steps.ASSESSMENTS.id],
    executionHandler: fetchFindings,
  },
  {
    id: Steps.LACEWORK_AWS_ENTITY_AWS_ENTITY_RELATIONSHIP.id,
    name: Steps.LACEWORK_AWS_ENTITY_AWS_ENTITY_RELATIONSHIP.name,
    entities: [],
    relationships: [MappedRelationships.LACEWORK_AWS_ENTITY_IS_AWS_ENTITY],
    dependsOn: [Steps.LACEWORK_AWS_ENTITY_FINDING_RELATIONSHIP.id],
    executionHandler: buildLaceworkAWSEntityToAWSEntityRelationship,
  },
  {
    id: Steps.LACEWORK_AWS_ENTITY_FINDING_RELATIONSHIP.id,
    name: Steps.LACEWORK_AWS_ENTITY_FINDING_RELATIONSHIP.name,
    entities: [Entities.AWS_ENTITY],
    relationships: [Relationships.LACEWORK_AWS_ENTITY_HAS_FINDING],
    dependsOn: [Steps.FINDINGS.id],
    executionHandler: buildLaceworkAWSEntityFindingRelationship,
  },

  {
    id: Steps.LACEWORK_AZURE_ENTITY_AZURE_ENTITY_RELATIONSHIP.id,
    name: Steps.LACEWORK_AZURE_ENTITY_AZURE_ENTITY_RELATIONSHIP.name,
    entities: [],
    relationships: [MappedRelationships.LACEWORK_AZURE_ENTITY_IS_AZURE_ENTITY],
    dependsOn: [Steps.LACEWORK_AZURE_ENTITY_FINDING_RELATIONSHIP.id],
    executionHandler: buildLaceworkAzureEntityToAzureEntityRelationship,
  },
  {
    id: Steps.LACEWORK_AZURE_ENTITY_FINDING_RELATIONSHIP.id,
    name: Steps.LACEWORK_AZURE_ENTITY_FINDING_RELATIONSHIP.name,
    entities: [Entities.AZURE_ENTITY],
    relationships: [Relationships.LACEWORK_AZURE_ENTITY_HAS_FINDING],
    dependsOn: [Steps.FINDINGS.id],
    executionHandler: buildLaceworkAzureEntityFindingRelationship,
  },
];
