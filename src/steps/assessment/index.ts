import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  createDirectRelationship,
  RelationshipClass,
  Entity,
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
import { createAssessmentEntity } from './converter';
import { LaceworkCloudAccount } from '../../types';
import { createAPIClient } from '../../client';

export async function fetchAssessments({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const serviceEntity = (await jobState.getData(
    SERVICE_ENTITY_DATA_KEY,
  )) as Entity;

  const allAssessments: any[] = [];

  await jobState.iterateEntities(
    { _type: Entities.CLOUD_ACCOUNT._type },
    async (cloudAccountEntity) => {
      const cloudAccount = getRawData<LaceworkCloudAccount>(cloudAccountEntity);
      if (!cloudAccount) {
        logger.warn(
          { _key: cloudAccountEntity._key },
          'Could not get raw data for cloud Account entity',
        );
        return;
      }

      let assessmentTypes: string[] = [];
      let primaryQueryId: string | undefined;
      let secondaryQueryIdList;

      if (cloudAccount.type.toLocaleLowerCase().startsWith('aws')) {
        const primaryQueryId =
          cloudAccount.data.crossAccountCredentials?.roleArn.substring(13, 25);

        for (const assessmentType of AWSAssesmentTypes) {
          await apiClient.getAWSAssessment(
            async (assessments) => {
              for (const assessment of assessments.data) {
                allAssessments.push(assessment);
                const assessmentEntity = await jobState.addEntity(
                  createAssessmentEntity(assessment, cloudAccount.intgGuid),
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
      } else if (cloudAccount.type.toLocaleLowerCase().startsWith('azure')) {
        /* Case when account type is related to Azure */
        assessmentTypes = AzureAssesmentTypes;
        primaryQueryId = cloudAccount.data.tenantId;

        if (cloudAccount.state.details.subscriptionErrors) {
          secondaryQueryIdList = Object.keys(
            cloudAccount.state.details.subscriptionErrors,
          );
        }

        await Promise.all(
          secondaryQueryIdList.map(async (secondaryQueryId) => {
            await Promise.all(
              assessmentTypes.map(async (type) => {
                await apiClient.getAzureGCPAssessment(
                  async (assessments) => {
                    for (const assessment of assessments.data) {
                      allAssessments.push(assessment);
                      const assessmentEntity = await jobState.addEntity(
                        createAssessmentEntity(
                          assessment,
                          cloudAccount.intgGuid,
                        ),
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
                  secondaryQueryId.toUpperCase(),
                );
              }),
            );
          }),
        );
      } else if (cloudAccount.type.toLocaleLowerCase().startsWith('gcp')) {
        /* List GCP projects through compliance evaluation endpoint */
        assessmentTypes = GCPAssesmentTypes;
        primaryQueryId = cloudAccount.data.id;

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
                async (assessments) => {
                  for (const assessment of assessments.data) {
                    allAssessments.push(assessment);
                    const assessmentEntity = await jobState.addEntity(
                      createAssessmentEntity(assessment, cloudAccount.intgGuid),
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
        return;
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
