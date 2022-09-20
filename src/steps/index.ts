import { accessListSteps as teamMemberSteps } from './team-member';
import { organizationSteps } from './organization';
import { cloudAccountSteps } from './cloudAccount';
import { assessmentSteps } from './assessment';
import { findingSteps } from './finding';
import { machineSteps } from './machine';
import { hostVulnerabilitySteps } from './hostVulnerability';

const integrationSteps = [
  ...organizationSteps,
  ...teamMemberSteps,
  ...cloudAccountSteps,
  ...assessmentSteps,
  ...findingSteps,
  ...machineSteps,
  ...hostVulnerabilitySteps,
];

export { integrationSteps };
