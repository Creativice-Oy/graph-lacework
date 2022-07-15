import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_ACCESS_KEY_ID = 'default_access_key_id';
const DEFAULT_SECRET_KEY = 'default_secret_key';
const DEFAULT_ORG_URL = 'lwintjupiterone.lacework.net';

export const integrationConfig: IntegrationConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID || DEFAULT_ACCESS_KEY_ID,
  secretKey: process.env.SECRET_KEY || DEFAULT_SECRET_KEY,
  organizationUrl: process.env.ORG_URL || DEFAULT_ORG_URL,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
