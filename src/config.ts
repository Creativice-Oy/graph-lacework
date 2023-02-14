import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessKeyId: {
    type: 'string',
    mask: true,
  },
  secretKey: {
    type: 'string',
    mask: true,
  },
  organizationUrl: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  accessKeyId: string;
  secretKey: string;
  organizationUrl: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.accessKeyId || !config.secretKey || !config.organizationUrl) {
    const missingFields: string[] = [];
    if (!config.accessKey) missingFields.push('accessKey');
    if (!config.secretKey) missingFields.push('secretKey');
    if (!config.organizationUrl) missingFields.push('organizationUrl');
    throw new IntegrationValidationError(
      `Config requires ${missingFields.join(', ')}`,
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.authenticate();
  await apiClient.verifyAuthentication();
}
