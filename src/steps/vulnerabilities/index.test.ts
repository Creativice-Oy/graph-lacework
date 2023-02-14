import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { tryParseCveId } from '.';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

let recording: Recording;

describe('tryParseCveId', () => {
  test('should correctly parse cve id if the title contains CVE keyword', () => {
    const cveId = tryParseCveId(
      'Ensure ELB is not affected by POODLE Vulnerability (CVE-2014-3566)',
    );
    expect(cveId).toEqual('CVE-2014-3566');
  });

  test('should return undefined if title does not contain CVE keyword', () => {
    const cveId = tryParseCveId(
      'Ensure ELB is not affected by POODLE Vulnerability (2014-3566)',
    );
    expect(cveId).toEqual(undefined);
  });
});

test('fetch-host-vulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-host-vulnerabilities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.HOST_VULNERABILITIES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);

  await recording.stop();
});

test('fetch-cloud-vulnerabilities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-cloud-vulnerabilities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.CLOUD_VULNERABILITIES.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);

  await recording.stop();
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
