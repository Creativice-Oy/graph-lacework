import { accessListSteps as teamMemberSteps } from './team-member';
import { organizationSteps } from './organization';

const integrationSteps = [
  ...organizationSteps,
  ...teamMemberSteps,
];

export { integrationSteps };
