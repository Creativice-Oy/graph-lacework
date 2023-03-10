import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  createDirectRelationship,
  RelationshipClass,
  Entity,
  JobState,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  AWSAssesmentTypes,
  AzureAssesmentTypes,
  GCPAssesmentTypes,
  Relationships,
  SERVICE_ENTITY_DATA_KEY,
} from '../constants';
import { createAssessmentEntity, getAssessmentKey } from './converter';
import { LaceworkCloudAccount } from '../../types';
import { APIClient, createAPIClient } from '../../client';

async function ingestAwsAssessments({
  account,
  serviceEntity,
  apiClient,
  jobState,
}: {
  account: LaceworkCloudAccount;
  serviceEntity: Entity;
  apiClient: APIClient;
  jobState: JobState;
}) {
  const primaryQueryId =
    account.data.crossAccountCredentials?.roleArn.substring(13, 25);

  for (const assessmentType of AWSAssesmentTypes) {
    await apiClient.getAWSAssessment(
      async (assessment) => {
        if (
          !jobState.hasKey(
            getAssessmentKey(
              assessment.reportType,
              account.intgGuid,
              assessment.reportTime,
            ),
          )
        ) {
          const assessmentEntity = await jobState.addEntity(
            createAssessmentEntity(assessment, account.intgGuid),
          );

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.PERFORMED,
              from: serviceEntity,
              to: assessmentEntity,
            }),
          );
        }
      },
      assessmentType,
      primaryQueryId,
    );
  }
}

async function ingestAzureAssessments({
  account,
  serviceEntity,
  apiClient,
  jobState,
}: {
  account: LaceworkCloudAccount;
  serviceEntity: Entity;
  apiClient: APIClient;
  jobState: JobState;
}) {
  const assessmentTypes = AzureAssesmentTypes;
  const primaryQueryId = account.data.tenantId;
  let secondaryQueryIdList;

  if (account.state.details.subscriptionErrors) {
    secondaryQueryIdList = Object.keys(
      account.state.details.subscriptionErrors,
    );
  }

  for (const secondaryQueryId of secondaryQueryIdList) {
    for (const assessmentType of assessmentTypes) {
      await apiClient.getAzureAssessment(
        async (assessment) => {
          if (
            !jobState.hasKey(
              getAssessmentKey(
                assessment.reportType,
                account.intgGuid,
                assessment.reportTime,
              ),
            )
          ) {
            const assessmentEntity = await jobState.addEntity(
              createAssessmentEntity(assessment, account.intgGuid),
            );
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.PERFORMED,
                from: serviceEntity,
                to: assessmentEntity,
              }),
            );
          }
        },
        assessmentType,
        primaryQueryId,
        secondaryQueryId.toUpperCase(),
      );
    }
  }
}

async function ingestGcpAssessments({
  account,
  serviceEntity,
  apiClient,
  jobState,
}: {
  account: LaceworkCloudAccount;
  serviceEntity: Entity;
  apiClient: APIClient;
  jobState: JobState;
}) {
  /* List GCP projects through compliance evaluation endpoint */
  const assessmentTypes = GCPAssesmentTypes;
  const primaryQueryId = account.data.id;

  const gcpProjectListRaw: string[] = [];
  await apiClient.getGCPProjectList((project) => {
    if (project.account.projectId != undefined) {
      gcpProjectListRaw.push(project.account.projectId);
    }
  });
  const gcpProjectList = [...new Set(gcpProjectListRaw)];

  await Promise.all(
    gcpProjectList.map(async (secondaryQueryId) => {
      for (const type of assessmentTypes) {
        await apiClient.getAzureGCPAssessment(
          async (assessment) => {
            if (
              !jobState.hasKey(
                getAssessmentKey(
                  assessment.reportType,
                  account.intgGuid,
                  assessment.reportTime,
                ),
              )
            ) {
              const assessmentEntity = await jobState.addEntity(
                createAssessmentEntity(assessment, account.intgGuid),
              );
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.PERFORMED,
                  from: serviceEntity,
                  to: assessmentEntity,
                }),
              );
            }
          },
          type,
          primaryQueryId,
          secondaryQueryId,
        );
      }
    }),
  );
}

export async function fetchAssessments({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const serviceEntity = (await jobState.getData(
    SERVICE_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.CLOUD_ACCOUNT._type },
    async (cloudAccountEntity) => {
      const account = getRawData<LaceworkCloudAccount>(cloudAccountEntity);
      if (!account) {
        logger.warn(
          { _key: cloudAccountEntity._key },
          'Could not get raw data for cloud Account entity',
        );
        return;
      }

      if (account.type.toLocaleLowerCase().startsWith('aws')) {
        await ingestAwsAssessments({
          account,
          serviceEntity,
          apiClient,
          jobState,
        });
      } else if (account.type.toLocaleLowerCase().startsWith('azure')) {
        await ingestAzureAssessments({
          account,
          serviceEntity,
          apiClient,
          jobState,
        });
      } else if (account.type.toLocaleLowerCase().startsWith('gcp')) {
        await ingestGcpAssessments({
          account,
          serviceEntity,
          apiClient,
          jobState,
        });
      }
    },
  );
}

export const assessmentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSESSMENTS.id,
    name: Steps.ASSESSMENTS.name,
    entities: [Entities.ASSESSMENT],
    relationships: [Relationships.SERVICE_PERFORMED_ASSESSMENT],
    dependsOn: [Steps.ACCOUNTS.id, Steps.SERVICE.id],
    executionHandler: fetchAssessments,
  },
];
