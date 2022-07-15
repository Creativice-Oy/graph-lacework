import { accessListSteps as teamMemberSteps } from './team-member';
import { organizationSteps } from './organization';
import { cloudAccountSteps } from './cloud-accounts';
import { assessmentSteps } from './assessment';
import { machineSteps } from './machine';
import { serviceSteps } from './service';
import { eventsSteps } from './events';
import { applicationSteps } from './applications';
import { packageSteps } from './package';
import { vulnerabilitySteps } from './vulnerabilities';

const integrationSteps = [
  ...organizationSteps,
  ...teamMemberSteps,
  ...serviceSteps,
  ...cloudAccountSteps,
  ...machineSteps,
  ...eventsSteps,
  ...applicationSteps,
  ...assessmentSteps,
  ...packageSteps,
  ...vulnerabilitySteps,
];

export { integrationSteps };
