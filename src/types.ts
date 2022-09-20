export interface LaceworkToken {
  expiresAt: string;
  token: string;
}

export interface LaceworPaginationResponse {
  paging: {
    rows: string;
    totalRows: string;
    urls: {
      nextPage: string;
    };
  };
}

export interface LaceworkPostRequestBody {
  timeFilter: {
    startTime: string;
    endTime: string;
  };
  filters: string[];
}

export interface LaceworkTeamMembers {
  data: LaceworkTeamMember[];
}

export interface LaceworkTeamMember {
  custGuid: string;
  props: {
    firstName: string;
    lastName: string;
    company: string;
    jitCreated: boolean;
    accountAdmin: boolean;
    orgAdmin: boolean;
    orgUser: boolean;
    createdTime: string;
  };
  userEnabled: number;
  userGuid: string;
  userName: string;
}

export interface LaceworkContainer extends LaceworPaginationResponse {
  data: {
    startTime: string;
    endTime: string;
    mid: number;
    containerName: string;
    podName: string;
    imageId: string;
    props: {
      IMAGE_CREATED_TIME: string;
      IMAGE_ID: string;
      IMAGE_SIZE: number;
      IMAGE_TAG: string;
      IMAGE_VERSION: string;
      IMAGE_VIRTUAL_SIZE: number;
      IPV4: string;
      NAME: string;
      PID_MODE: string;
      POD_IP_ADDR: string;
      POD_TYPE: string;
      PRIVILEGED: number;
      PROPS_LABEL: any;
      VOLUME_MAP: any;
    };
    tags: any;
  }[];
}

export interface LaceworkAssessment extends LaceworPaginationResponse {
  data: {
    reportType: string;
    reportTitle: string;

    accountId: string;
    accountAlias: string;
    reportTime: string;

    recommendations: {
      ACCOUNT_ID: string;
      ACCOUNT_ALIAS: string;
      START_TIME: number;
      SUPRESSIONS: string[];
      INFO_LINK: string;
      ASSESSED_RESOURCE_COUNT: number;
      STATUS: string;
      REC_ID: string;
      CATEGORY: string;
      SERVICE: string;
      TITLE: string;
      VIOLATIONS: {
        reasons: string[];
        resource: string;
      }[];
      RESOURCE_COUNT: number;
      SEVERITY: number;
    }[];

    summary: {
      NUM_RECOMMENDATIONS: number;
      NUM_SEVERITY_2_NON_COMPLIANCE: number;
      NUM_SEVERITY_4_NON_COMPLIANCE: number;
      NUM_SEVERITY_1_NON_COMPLIANCE: number;
      NUM_COMPLIANT: number;
      NUM_SEVERITY_3_NON_COMPLIANCE: number;
      ASSESSED_RESOURCE_COUNT: number;
      NUM_SUPPRESSED: number;
      violations;
      NUM_SEVERITY_5_NON_COMPLIANCE: number;
      NUM_NOT_COMPLIANT: number;
      VIOLATED_RESOURCE_COUNT: number;
      SUPPRESSED_RESOURCE_COUNT: number;
    };
  };

  ok?: string;
  message?: string;
}

export interface LaceworkCloudAccount extends LaceworPaginationResponse {
  intgGuid: string;
  name: string;
  type: string;
  data: {
    awsAccountId?: string;
    crossAccountCredentials?: {
      externalId: string;
      roleArn: string;
    };
    queueUrl?: string;
    credentials?: {
      clientId?: string;
      clientSecret?: string;

      clientEmail?: string;
    };
    tenantId?: string;

    id?: string;
    idType?: string;
  };

  state: {
    ok: boolean;
    details: {
      tenantErrors?: {
        opsDeniedAccess?: string[];
      };
      subscriptionErrors?: {};
    };
  };
}

export interface LaceworkRecommendation extends LaceworPaginationResponse {
  ACCOUNT_ID: string;
  ACCOUNT_ALIAS: string;

  TENANT_ID: string;
  TENANT_NAME: string;
  SUBSCRIPTION_ID: string;
  SUBSCRIPTION_NAME: string;

  START_TIME: number;
  SUPRESSIONS: string[];
  INFO_LINK: string;
  ASSESSED_RESOURCE_COUNT: number;
  STATUS: string;
  REC_ID: string;
  CATEGORY: string;
  SERVICE: string;
  TITLE: string;
  VIOLATIONS: {
    reasons: string[];
    resource: string;
  }[];
  RESOURCE_COUNT: number;
  SEVERITY: number;
}

export interface LaceworkMachine extends LaceworPaginationResponse {
  hostname: string;
  machineTags: {
    Hostname: string;
    LwTokenShort: string;
    arch: string;
    os: String;
  };
  mid: string;
  primaryIpAddr: string;
}

export interface LaceworkHostVulnerability extends LaceworPaginationResponse {
  cveProps: {
    cve_batch_id: string;
    description: string;

    //weburl??
    link: string;

    metadata?: {
      NVD: {
        CVSSv2: {
          PublishedDateTime: string;
          Score: string;
          Vectors: string;
        };
        CVSSv3: {
          ExploitabilityScore: string;
          ImpactScore: string;
          Score: string;
          Vectors: string;
        };
      };
    };
  };
  featureKey: {
    name: string;
    namespace: string;
    package_active: string;
    package_path: string;
    version_installed;
  };
  machineTags: {
    Hostname: string;
    LwTokenShort: string;
    arch: string;
    os: string;
  };
  props: {
    first_time_seen: string;
    isDailyJob: string;
    last_updated_time: string;
  };
  vulnId: string;
  status: string;
}

export interface LaceworkAWSEntity {
  arn: string;
}

export interface LaceworkAzureEntity {
  urn: string;
}
