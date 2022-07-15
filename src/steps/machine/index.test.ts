import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-machines', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-machines',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.MACHINES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-machine-application-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-machine-application-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.MACHINE_APPLICATION_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
