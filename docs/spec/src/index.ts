import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { organizationSpec } from './organization';
import { teamMemberSpec } from './team-member';
import { assessmentSpec } from './assessment';
import { findingSpec } from './finding';
import { hostVulnerabilitySpec } from './hostVulnerability';
import { machineSpec } from './machine';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...organizationSpec,
    ...teamMemberSpec,
    ...assessmentSpec,
    ...findingSpec,
    ...hostVulnerabilitySpec,
    ...machineSpec,
  ],
};
