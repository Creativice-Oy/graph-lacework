import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { organizationSpec } from './organization';
import { teamMemberSpec } from './team-member';
import { containerSpec } from './container';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...organizationSpec,
    ...teamMemberSpec,
    ...containerSpec,
  ],
};
