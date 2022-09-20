import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  AWSCloudAccountTypes,
  AzureCloudAccountTypes,
  GCPCloudAccountTypes,
  AWSAssesmentTypes,
  AzureAssesmentTypes,
  GCPAssesmentTypes,
} from '../constants';
import { createAssessmentEntity } from './converter';
import { LaceworkCloudAccount } from '../../types';
import { createAPIClient } from '../../client';

// iterate over all cloud accounts then over all assessment types
// for that type of cloud account
export async function fetchAssessments({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

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
      let secondaryQueryId: string | undefined;
      let secondaryQueryIdList;

      /* Case when account type is related to AWS */
      if (AWSCloudAccountTypes.includes(cloudAccount.type)) {
        assessmentTypes = AWSAssesmentTypes;

        primaryQueryId =
          cloudAccount.data.crossAccountCredentials?.roleArn.substring(13, 25);

        await Promise.all(
          assessmentTypes.map(async (type) => {
            await apiClient.getAWSAssessment(
              async (assessment) => {
                await jobState.addEntity(
                  createAssessmentEntity(assessment, cloudAccount.intgGuid),
                );
              },
              type,
              primaryQueryId,
              secondaryQueryId,
            );
          }),
        );
      } else if (AzureCloudAccountTypes.includes(cloudAccount.type)) {
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
                await apiClient.getAzureAssessment(
                  async (assessment) => {
                    await jobState.addEntity(
                      createAssessmentEntity(assessment, cloudAccount.intgGuid),
                    );
                  },
                  type,
                  primaryQueryId,
                  secondaryQueryId.toUpperCase(),
                );
              }),
            );
          }),
        );
      } else if (GCPCloudAccountTypes.includes(cloudAccount.type)) {
        /* Case when account type is related to GCP */
        return;
        assessmentTypes = GCPAssesmentTypes;
      }
    },
  );
}

export const assessmentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSESSMENTS.id,
    name: Steps.ASSESSMENTS.name,
    entities: [Entities.ASSESSMENT],
    relationships: [],
    dependsOn: [Steps.ACCOUNTS.id],
    executionHandler: fetchAssessments,
  },
];
