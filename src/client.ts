import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import {
  LaceworToken,
  LaceworkTeamMember,
  LaceworkTeamMembers,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {
    this.tokenRequest = {
      keyId: config.accessKeyId,
      expiryTime: 86400,
    };
  }

  private baseUri = `https://${this.config.organizationUrl}`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private tokenRequest: {
    keyId: string;
    expiryTime: number;
  };
  private token: LaceworToken;

  private isTokenValid() {
    if (!this.token?.expiresAt || !this.token?.token) {
      return false;
    }else if (Date.now() >= parseTimePropertyValue(this.token.expiresAt)) {
      return false;
    }
    return true;
  }

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  public async authenticate(): Promise<any> {
    try {
      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(
            this.withBaseUri('/api/v2/access/tokens'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-LW-UAKS': this.config.secretKey,
              },
              body: JSON.stringify(this.tokenRequest),
            }
          );
          return this.checkStatus(res);
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: this.withBaseUri('/api/v2/access/tokens'),
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<any> {
    try {
      // Handle rate-limiting
      const response = await retry(
        async () => {
          if (!this.isTokenValid()) {
            this.token = await this.authenticate();
          }
          const res: Response = await fetch(uri, {
            method,
            headers: {
              Authorization: this.token.token,
            },
          });
          return this.checkStatus(res);
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
    iterateeKey: string,
  ): Promise<void> {
    try {
      let nextUri = null;
      do {
        const response = await this.request(nextUri || uri, method);
        nextUri =
          response.paging?.urls?.nextPage
            ? response.paging?.urls?.nextPage
            : null;
        for (const item of response) {
          await iteratee(item);
        }
      } while (nextUri);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('/api/v2/TeamMembers');
    try {
      await this.request(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each team member resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateTeamMembers(
    iteratee: ResourceIteratee<LaceworkTeamMember>,
  ): Promise<void> {
    const teamMembers: LaceworkTeamMembers = await this.request(
      this.withBaseUri(`/api/v2/TeamMembers`),
      'GET',
    );
    for (const teamMember of teamMembers.data) {
      await iteratee(teamMember);
    }
  }

  /**
   * Iterates each database resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDatabases(
    iteratee: ResourceIteratee<LaceworkTeamMember>,
  ): Promise<void> {
    await this.paginatedRequest<LaceworkTeamMember>(
      this.withBaseUri(`/v2/databases`),
      'GET',
      iteratee,
      'id',
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
