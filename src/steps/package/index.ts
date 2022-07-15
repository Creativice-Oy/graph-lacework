import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Steps,
  Entities,
  ORGANIZATION_ENTITY_DATA_KEY,
  Relationships,
} from '../constants';
import { createPackageEntity } from './converter';
import { getPackageKey } from './converter';
import { createAPIClient } from '../../client';

export async function fetchPackages({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const organizationEntity = (await jobState.getData(
    ORGANIZATION_ENTITY_DATA_KEY,
  )) as Entity;

  await apiClient.iteratePackages(async (laceworkPackage) => {
    const hasPackage = await jobState.hasKey(
      getPackageKey(
        laceworkPackage.packageName,
        laceworkPackage.arch,
        laceworkPackage.version,
      ),
    );

    if (!hasPackage) {
      const packageEntity = await jobState.addEntity(
        createPackageEntity(laceworkPackage),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: organizationEntity,
          to: packageEntity,
        }),
      );
    }
  });
}

export const packageSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PACKAGES.id,
    name: Steps.PACKAGES.name,
    entities: [Entities.PACKAGE],
    relationships: [Relationships.ORGANIZATION_HAS_PACKAGE],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchPackages,
  },
];
