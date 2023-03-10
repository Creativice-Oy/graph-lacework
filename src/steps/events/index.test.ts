import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-alert-findings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-alert-findings',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ALERT_FINDINGS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
