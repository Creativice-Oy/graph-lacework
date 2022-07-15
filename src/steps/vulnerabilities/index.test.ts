import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-host-vulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-host-vulnerabilities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.HOST_VULNERABILITIES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('fetch-cloud-vulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-cloud-vulnerabilities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.CLOUD_VULNERABILITIES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

// TODO: write this test using old pattern because mapped relationships aren't supported
// test('build-vulnerability-cve-relationship', async () => {
//   recording = setupProjectRecording({
//     directory: __dirname,
//     name: 'build-vulnerability-cve-relationship',
//   });

//   const stepConfig = buildStepTestConfigForStep(Steps.VULNERABILITY_CVE_RELATIONSHIP.id);
//   const stepResult = await executeStepWithDependencies(stepConfig);
//   expect(stepResult).toMatchStepMetadata(stepConfig);
// });
