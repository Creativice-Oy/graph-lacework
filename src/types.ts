export interface LaceworkToken {
  expiresAt: string;
  token: string;
}

export interface LaceworkPaginationResponse {
  paging: {
    rows: string;
    totalRows: string;
    urls: {
      nextPage: string;
    };
  };
}

export type CloudProvider = 'AWS' | 'Azure' | 'GCP';

export interface LaceworkCloudEntity extends LaceworkPaginationResponse {
  urn: string;
  csp: string;
  apiKey: string;
  startTime: string;
  endTime: string;
  resourceType: string;

  resourceConfig?: string;
  resourceRegion?: string;
  resourceId?: string;
  cloudDetails: {};
}

export interface LaceworkPostRequestBody {
  timeFilter: {
    startTime: string;
    endTime: string;
  };
  filters: string[];
  dataset?: string;
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

export interface LaceworkContainer extends LaceworkPaginationResponse {
  startTime: string;
  endTime: string;
  mid: number;
  containerName: string;
  podName: string;
  imageId: string;
  propsContainer: {
    CONTAINER_START_TIME: string;
    CONTAINER_TYPE: string;
    IMAGE_AUTHOR: string;
    IMAGE_CREATED_TIME: string;
    IMAGE_ID: string;
    IMAGE_PARENT_ID: string;
    IMAGE_REPO: string;
    IMAGE_SIZE: number;
    IMAGE_TAG: string;
    IMAGE_VERSION: string;
    IMAGE_VIRTUAL_SIZE: string;
    IPV4: string;
    LISTEN_PORT_MAP: any;
    NAME: string;
    NETWORK_MODE: string;
    PID_MODE: string;
    PRIVILEDGE: number;
  };
  tags: any;
}

export interface LaceworkAssessmentsResponse
  extends LaceworkPaginationResponse {
  data: LaceworkAssessment[];
  ok?: string;
  message?: string;
}

export interface LaceworkAssessment {
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
}

export interface LaceworkAssessment extends LaceworkPaginationResponse {
  data: {
    reportType: string;
    reportTitle: string;

    accountId: string;
    accountAlias: string;
    reportTime: string;

    recommendations: {
      //AWS Specific attributes
      ACCOUNT_ID: string;
      ACCOUNT_ALIAS: string;

      //Azure Specific attributes
      TENANT_ID: string;
      TENANT_NAME: string;
      SUBSCRIPTION_ID: string;
      SUBSCRIPTION_NAME: string;

      //GCP Specific attributes
      PROJECT_ID: string;
      PROJECT_NAME: string;
      ORGANIZATION_ID: string;
      ORGANIZATION_NAME: string;

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
        region?: string;
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

export interface LaceworkCloudAccount extends LaceworkPaginationResponse {
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

export interface LaceworkRecommendation extends LaceworkPaginationResponse {
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

export interface LaceworkMachine extends LaceworkPaginationResponse {
  hostname: string;
  machineTags?: {
    ExternalIp: string;
    Hostname: string;
    InstanceId: string;
    InstanceName: string;
    InternalIp: string;
    NumericProjectId: string;
    ProjectId: string;
    VmInstanceType: string;
    VmProvider: string;
    Zone: string;
    arch: string;
    os: string;
  };
  mid: number;
  primaryIpAddr: string;
  startTime: string;
}

export interface LaceworkPackage extends LaceworkPaginationResponse {
  createdTime: string;
  mid: number;
  packageName: string;
  version: string;
  arch: string;
}

export interface LaceworkApplication extends LaceworkPaginationResponse {
  startTime: string;
  endTime: string;
  mid: string;
  appName: string;
  exePath: string;
  username: {
    effective: string;
    original: string;
  };
  propsMachine: {
    hostname: string;
    ip_addr: string;
    mem_kbytes: number;
    num_users: number;
    primary_tags: string[];
    tags?: {
      ExternalIp: string;
      Hostname: string;
      InstanceId: string;
      InstanceName: string;
      InternalIp: string;
      LwTokenShort: string;
      NumericProjectId: string;
      ProjectId: string;
      VmInstanceType: string;
      VmProvider: string;
      Zone: string;
      arch: string;
      os: string;
    };
    up_time: number;
  };
  containerInfo: {
    image_repo?: string;
    image_tag?: string;
    pod_ip_addr?: string;
    pod_type?: string;
    vm_type: string;
  };
  netStats: {
    num_bytes_external_client?: number;
    num_bytes_external_server?: number;
    num_bytes_in_external_client?: number;
    num_bytes_in_external_server?: number;
    num_bytes_in_internal_client?: number;
    num_bytes_in_internal_server?: number;
    num_bytes_internal_client?: number;
    num_bytes_internal_server?: number;
    num_bytes_out_internal_client?: number;
    num_bytes_out_internal_server?: number;
    num_in_bytes?: number;
    num_in_client_bytes?: number;
    num_in_server_bytes?: number;
    num_out_bytes?: number;
    num_out_client_bytes?: number;
    num_out_server_bytes?: number;
    num_total_bytes?: number;
  };
}

export interface LaceworkPod extends LaceworkPaginationResponse {
  startTime: string;
  endTime: string;
  mid: string;
  podName: string;
  primaryIpAddr: string;
  propsContainer: {
    CONTAINER_TYPE: string;
    IMAGE_CREATED_TIME: string;
    IMAGE_ID: string;
    IMAGE_REPO: string;
    IMAGE_SIZE: string;
    IMAGE_TAG: string;
    IMAGE_VERSION: string;
    IMAGE_VIRTUAL_SIZE: string;
    IPV4: string;
    NAME: string;
    NETWORK_MODE: string;
    PID_MODE: string;
    POD_TYPE: string;
    PRIVELEGED: string;
    PROPS_LABEL: {};
  };
}

export interface Event {
  exe_path: string;
  hostname: string;
  isVuln: number;
  mid: string;
  pid_hash: string;
  severity: number;
  username: string;
  vulnDetails: string;
}

export interface LaceworkEvent extends LaceworkPaginationResponse {
  dstEvent: Event;
  dstType: string;
  endTime: string;
  eventCount: string;
  eventType: string;
  id: string;
  srcEvent: Event;
  srcType: string;
  startTime: string;
}
export interface LaceworkHostVulnerability extends LaceworkPaginationResponse {
  cveProps: {
    cve_batch_id: string;
    description: string;
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
  mid: string;
  vulnId: string;
  status: string;
  severity: any;
}

export interface LaceworkEvaluationConfig extends LaceworkPaginationResponse {
  account: any;
  evalType: string;
  id: string;
  reason: string;
  recommendation: string;
  region: string;
  reportTime: string;
  resource: string;
  section: string;
  severity: string;
  status: string;
}
export interface LaceworkAWSEntity {
  arn: string;
}

export interface LaceworkAzureEntity {
  urn: string;
}
