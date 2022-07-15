import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  Relationships,
  MappedRelationships,
} from '../constants';

import {
  createCloudVulnerabilityEntity,
  createHostVulnerabilityEntity,
  getCloudVulnerabilityKey,
  getHostVulnerabilityKey,
  createFindingCveRelationship,
} from './converter';

import { getMachineKey } from '../machine/converter';
import {
  LaceworkAssessment,
  LaceworkHostVulnerability,
  LaceworkRecommendation,
} from '../../types';
import { createAPIClient } from '../../client';

function isAssessmentVulnerability(
  object: any,
): object is LaceworkRecommendation {
  return typeof object.TITLE === 'string';
}

function isHostVulnerability(object: any): object is LaceworkHostVulnerability {
  return typeof object.cveProps === 'object';
}

export async function fetchCloudVulnerabilities({
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

      for (const recommendation of assessment.recommendations) {
        // Assumption is that this is vulnerability since it contains CVE
        // This could be wrong, but in general recommendation ISN't vulnerability by default
        if (recommendation.TITLE.toLowerCase().includes('cve')) {
          const hasVuln = await jobState.hasKey(
            getCloudVulnerabilityKey(
              recommendation.REC_ID,
              recommendation.SERVICE,
            ),
          );

          if (!hasVuln) {
            const vulnerabilityEntity = await jobState.addEntity(
              createCloudVulnerabilityEntity(recommendation),
            );
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.IDENTIFIED,
                from: assessmentEntity,
                to: vulnerabilityEntity,
              }),
            );
          }
        }
      }
    },
  );
}

export async function fetchHostVulnerabilities({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateHostVulnerabilities(async (hostVulnerability) => {
    if (!hostVulnerability.vulnId) {
      return;
    }

    if (
      await jobState.findEntity(
        getHostVulnerabilityKey(
          hostVulnerability.machineTags.Hostname,
          hostVulnerability.vulnId,
          hostVulnerability.featureKey,
        ),
      )
    ) {
      return;
    }

    const hostVulnerabilityEntity = await jobState.addEntity(
      createHostVulnerabilityEntity(hostVulnerability),
    );

    const machineEntity = await jobState.findEntity(
      getMachineKey(parseInt(hostVulnerability.mid, 10)),
    );

    if (machineEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: machineEntity,
          to: hostVulnerabilityEntity,
        }),
      );
    }
  });
}

export async function buildVulnerabilityCveRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.VULNERABILITY._type },
    async (vulnerabilityEntity) => {
      const vulnerability = getRawData<
        LaceworkRecommendation | LaceworkHostVulnerability
      >(vulnerabilityEntity);
      if (!vulnerability) {
        logger.warn(
          { _key: vulnerabilityEntity._key },
          'Could not get raw data for vulnerability entity',
        );
        return;
      }

      if (isAssessmentVulnerability(vulnerability)) {
        const titleComponents = vulnerability.TITLE.split('(');
        let cveId;
        if (titleComponents.length > 0) {
          cveId = titleComponents[titleComponents.length - 1].slice(0, -1);
        }

        if (cveId) {
          await jobState.addRelationship(
            createFindingCveRelationship(vulnerabilityEntity, cveId),
          );
        }
      } else if (isHostVulnerability(vulnerability)) {
        const cveId = vulnerability.vulnId;
        if (cveId) {
          await jobState.addRelationship(
            createFindingCveRelationship(vulnerabilityEntity, cveId, {
              severity: vulnerability.severity,
            }),
          );
        }
      }
    },
  );
}

export const vulnerabilitySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CLOUD_VULNERABILITIES.id,
    name: Steps.CLOUD_VULNERABILITIES.name,
    entities: [Entities.VULNERABILITY],
    relationships: [Relationships.ASSESSMENT_IDENTIFIED_VULNERABILITY],
    dependsOn: [Steps.ASSESSMENTS.id],
    executionHandler: fetchCloudVulnerabilities,
  },
  {
    id: Steps.HOST_VULNERABILITIES.id,
    name: Steps.HOST_VULNERABILITIES.name,
    entities: [Entities.VULNERABILITY],
    relationships: [Relationships.MACHINE_HAS_VULNERABILITY],
    dependsOn: [Steps.MACHINES.id],
    executionHandler: fetchHostVulnerabilities,
  },
  {
    id: Steps.VULNERABILITY_CVE_RELATIONSHIP.id,
    name: Steps.VULNERABILITY_CVE_RELATIONSHIP.name,
    entities: [],
    relationships: [],
    mappedRelationships: [MappedRelationships.VULNERABILITY_IS_CVE],
    dependsOn: [Steps.CLOUD_VULNERABILITIES.id, Steps.HOST_VULNERABILITIES.id],
    executionHandler: buildVulnerabilityCveRelationships,
  },
];
