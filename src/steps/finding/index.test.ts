import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';
jest.setTimeout(50000);
// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-findings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-findings',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FINDINGS.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-lacework-aws-entity-finding-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-lacework-aws-entity-finding-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.LACEWORK_AWS_ENTITY_FINDING_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test.skip('build-lacework-aws-entity-aws-entity-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-lacework-aws-entity-aws-entity-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.LACEWORK_AWS_ENTITY_AWS_ENTITY_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-lacework-azure-entity-finding-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-lacework-azure-entity-finding-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.LACEWORK_AZURE_ENTITY_FINDING_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test.skip('build-lacework-azure-entity-azure-entity-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-lacework-azure-entity-azure-entity-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.LACEWORK_AZURE_ENTITY_AZURE_ENTITY_RELATIONSHIP.id,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
