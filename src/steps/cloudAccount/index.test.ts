import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-cloud-accounts', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-cloud-accounts',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ACCOUNTS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
