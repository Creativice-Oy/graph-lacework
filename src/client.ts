import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import {
  LaceworkToken,
  LaceworkPostRequestBody,
  LaceworkTeamMember,
  LaceworkTeamMembers,
  LaceworkAssessment,
  LaceworkCloudAccount,
  LaceworkMachine,
  LaceworkHostVulnerability,
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
  private token: LaceworkToken;

  private isTokenValid() {
    if (!this.token?.expiresAt || !this.token?.token) {
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
            this.withBaseUri('/api/v2/access/tokens'),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-LW-UAKS': this.config.secretKey,
              },
              body: JSON.stringify(this.tokenRequest),
            },
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

  private async postRequest(
    uri: string,
    method: string,
    body: LaceworkPostRequestBody,
  ): Promise<any> {
    try {
      // Handle rate-limiting
      //get time now
      const response = await retry(
        async () => {
          if (!this.isTokenValid()) {
            this.token = await this.authenticate();
          }

          const res: Response = await fetch(uri, {
            method: method,
            headers: {
              Authorization: this.token.token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
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
        nextUri = response.paging?.urls?.nextPage
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

  //refactor this to use generic paginated request with additional params
  private async paginatedCloudAccountRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
    iterateeKey: string,
  ): Promise<void> {
    try {
      let nextUri = null;
      do {
        const response = await this.request(nextUri || uri, method);
        nextUri = response.paging?.urls?.nextPage
          ? response.paging?.urls?.nextPage
          : null;
        for (const item of response.data) {
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

  private async paginatedAssessmentRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
    iterateeKey: string,
  ): Promise<void> {
    try {
      let nextUri = null;
      do {
        const response = await this.request(nextUri || uri, method);
        nextUri = response.paging?.urls?.nextPage
          ? response.paging?.urls?.nextPage
          : null;

        await iteratee(response);
        /*for (const item of response) {
          await iteratee(item);
        }*/
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

  private async paginatedEntityRequest<T>(
    uri: string,
    iteratee: ResourceIteratee<T>,
    body: LaceworkPostRequestBody,
  ): Promise<void> {
    try {
      let nextUri = null;
      let method = 'POST';
      do {
        let response;
        if (method == 'POST') {
          response = await this.postRequest(uri, method, body);
          method = 'GET';
        } else {
          response = await this.request(nextUri || uri, 'GET');
        }
        nextUri = response.paging?.urls?.nextPage
          ? response.paging?.urls?.nextPage
          : null;
        for (const item of response.data) {
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
    const uri = this.withBaseUri('/api/v2/CloudAccounts');
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
  //refactor rpimaryQueryID type(cannot be undefined) but maybe undefined in the defined type
  public async getAWSAssessment(
    iteratee: ResourceIteratee<LaceworkAssessment>,
    assessmentType: string,
    primaryQueryId: string | undefined,
    secondaryQueryId: string | undefined,
  ): Promise<void> {
    if (!secondaryQueryId) {
      await this.paginatedAssessmentRequest<LaceworkAssessment>(
        this.withBaseUri(
          `/api/v2/Reports?primaryQueryId=${primaryQueryId}&format=json&reportType=${assessmentType}`,
        ),
        'GET',
        iteratee,
        'id',
      );
    }
  }

  public async getAzureAssessment(
    iteratee: ResourceIteratee<LaceworkAssessment>,
    assessmentType: string,
    primaryQueryId: string | undefined,
    secondaryQueryId: string | undefined,
  ): Promise<void> {
    await this.paginatedAssessmentRequest<LaceworkAssessment>(
      this.withBaseUri(
        `/api/v2/Reports?primaryQueryId=${primaryQueryId}&secondaryQueryId=${secondaryQueryId}&format=json&reportType=${assessmentType}`,
      ),
      'GET',
      iteratee,
      'id',
    );
  }
  /*   public async getAWSEntity(
    arn: string,
  ): Promise<void> {
    await this.paginatedAssessmentRequest<LaceworkAssessment>(
      this.withBaseUri(`/api/v2/Reports?primaryQueryId=${primaryQueryId}&secondaryQueryId=${secondaryQueryId}&format=json&reportType=${assessmentType}`),
      'GET',
      iteratee,
      'id',
    );
  } */
  public async iterateCloudAccounts(
    iteratee: ResourceIteratee<LaceworkCloudAccount>,
  ): Promise<void> {
    await this.paginatedCloudAccountRequest<LaceworkCloudAccount>(
      this.withBaseUri(`/api/v2/CloudAccounts`),
      'GET',
      iteratee,
      'id',
    );
  }

  public async iterateMachines(
    iteratee: ResourceIteratee<LaceworkMachine>,
  ): Promise<void> {
    const now = new Date();
    const start: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const body: LaceworkPostRequestBody = {
      timeFilter: {
        startTime: start.toISOString(),
        endTime: now.toISOString(),
      },
      filters: [],
    };
    await this.paginatedEntityRequest<LaceworkMachine>(
      this.withBaseUri(`/api/v2/Entities/Machines/search`),
      iteratee,
      body,
    );
  }
  public async iterateHostVulnerabilities(
    iteratee: ResourceIteratee<LaceworkHostVulnerability>,
  ): Promise<void> {
    const now = new Date();
    const start: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const body: LaceworkPostRequestBody = {
      timeFilter: {
        startTime: start.toISOString(),
        endTime: now.toISOString(),
      },
      filters: [],
    };
    await this.paginatedEntityRequest<LaceworkHostVulnerability>(
      this.withBaseUri(`/api/v2/Vulnerabilities/Hosts/search`),
      iteratee,
      body,
    );
  }

  public async iterateAssessments(
    iteratee: ResourceIteratee<LaceworkCloudAccount>,
  ): Promise<void> {
    await this.paginatedCloudAccountRequest<LaceworkCloudAccount>(
      this.withBaseUri(`/api/v2/CloudAccounts`),
      'GET',
      iteratee,
      'id',
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
