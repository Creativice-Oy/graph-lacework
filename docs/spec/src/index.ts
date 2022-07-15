import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { organizationSpec } from './organization';
import { teamMemberSpec } from './team-member';
import { assessmentSpec } from './assessment';
import { serviceSpec } from './service';
import { machineSpec } from './machine';
import { cloudAccountSpec } from './cloud-account';
import { eventsSpec } from './events';
import { packageSpec } from './package';
import { applicationSpec } from './application';
import { vulnerabilitySpec } from './vulnerability';
export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...organizationSpec,
    ...teamMemberSpec,
    ...serviceSpec,
    ...cloudAccountSpec,
    ...machineSpec,
    ...eventsSpec,
    ...packageSpec,
    ...applicationSpec,
    ...vulnerabilitySpec,
    ...assessmentSpec,
  ],
};
