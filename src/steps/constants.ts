import {
  RelationshipClass,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const AWSAssesmentTypes = [
  'AWS_CIS_S3',
  'NIST_800-171_Rev2',
  'ISO_2700',
  'HIPAA',
  'SOC',
  'AWS_SOC_Rev2',
  'PCI',
];

export const AzureAssesmentTypes = [
  'AZURE_CIS_131',
  'AZURE_SOC',
  'AZURE_SOC_Rev2',
  'AZURE_ISO_27001',
  'AZURE_NIST_CSF',
  'AZURE_NIST_800_53_REV5',
  'AZURE_NIST_800_171_REV2',
  'AZURE_HIPAA',
];

export const GCPAssesmentTypes = [
  'NIST_800-53_Rev4',
  'NIST_800-171_Rev2',
  'ISO_2700',
  'HIPAA',
  'SOC',
  'PCI',
  'GCP_CSI',
  'GCP_SOC',
  'GCP_CIS12',
  'GCP_K8S',
  'GCP_PCI_Rev2',
  'GCP_SOC_Rev2',
  'GCP_HIPAA_Rev2',
  'GCP_ISO_27001',
  'GCP_NIST_CSF',
  'GCP_NIST_800_53_REV4',
  'GCP_NIST_800_171_REV2',
  'GCP_PCI',
];

export const AWSCloudAccountTypes = [
  'AwsCfg',
  'AwsCtSqs',
  'AwsEksAudit',
  'AwsUsGovCfg',
  'AwsUsGovCtSqs',
];

export const AzureCloudAccountTypes = ['AzureAlSeq', 'AzureCfg'];

export const GCPCloudAccountTypes = ['GcpAtSes', 'GcpCfg'];
export const Steps = {
  ORGANIZATION: 'fetch-organization',
  TEAM_MEMBERS: 'fetch-team-members',
  ACCOUNTS: {
    id: 'fetch-cloud-accounts',
    name: 'Fetch Cloud Accounts',
  },
  ASSESSMENTS: {
    id: 'fetch-assessments',
    name: 'Fetch Assessments',
  },
  FINDINGS: {
    id: 'fetch-findings',
    name: 'Fetch Findings',
  },
  MACHINES: {
    id: 'fetch-machines',
    name: 'Fetch Machines',
  },
  HOST_VULNERABILITIES: {
    id: 'fetch-host-vulnerabilities',
    name: 'fetch-host-vulnerabilities',
  },
  LACEWORK_AWS_ENTITY_FINDING_RELATIONSHIP: {
    id: 'build-lacework-aws-entity-finding-relationship',
    name: 'Build Lacework AWS Entity and Finding Relationship',
  },
  LACEWORK_AWS_ENTITY_AWS_ENTITY_RELATIONSHIP: {
    id: 'build-lacework-aws-entity-aws-entity-relationship',
    name: 'Build Lacework AWS Entity and AWS Entity Relationship',
  },
  LACEWORK_AZURE_ENTITY_FINDING_RELATIONSHIP: {
    id: 'build-lacework-azure-entity-finding-relationship',
    name: 'Build Lacework Azure Entity and Finding Relationship',
  },
  LACEWORK_AZURE_ENTITY_AZURE_ENTITY_RELATIONSHIP: {
    id: 'build-lacework-azure-entity-azure-entity-relationship',
    name: 'Build Lacework Azure Entity and Azure Entity Relationship',
  },
};

export const Entities: Record<
  | 'ORGANIZATION'
  | 'TEAM_MEMBER'
  | 'ASSESSMENT'
  | 'CLOUD_ACCOUNT'
  | 'FINDING'
  | 'MACHINE'
  | 'HOST_VULNERABILITY'
  | 'AWS_ENTITY'
  | 'AZURE_ENTITY',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'lacework_organization',
    _class: ['Organization'],
  },
  TEAM_MEMBER: {
    resourceName: 'Team Member',
    _type: 'lacework_team_member',
    _class: ['User'],
  },
  ASSESSMENT: {
    resourceName: 'Assessment',
    _type: 'lacework_assessment',
    _class: ['Assessment'],
  },
  CLOUD_ACCOUNT: {
    resourceName: 'Cloud Account',
    _type: 'lacework_cloud_account',
    _class: ['Account'],
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'lacework_finding',
    _class: ['Finding'],
  },
  MACHINE: {
    resourceName: 'Machine',
    _type: 'lacework_machine',
    _class: ['Host'],
  },
  HOST_VULNERABILITY: {
    resourceName: 'Host Vulnerability',
    _type: 'lacework_host_vulnerability',
    _class: ['Host'],
  },
  AWS_ENTITY: {
    resourceName: 'AWS Entity',
    _type: 'lacework_aws_entity',
    _class: ['Entity'],
  },
  AZURE_ENTITY: {
    resourceName: 'Azure Entity',
    _type: 'lacework_azure_entity',
    _class: ['Entity'],
  },
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_TEAM_MEMBER'
  | 'CLOUD_ACCOUNT_HAS_ASSESSMENT'
  | 'ASSESSMENT_IDENFIED_FINDING'
  | 'LACEWORK_AWS_ENTITY_HAS_FINDING'
  | 'LACEWORK_AZURE_ENTITY_HAS_FINDING'
  | 'MACHINE_HAS_FINDING',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_TEAM_MEMBER: {
    _type: 'lacework_organization_has_team_member',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM_MEMBER._type,
  },
  CLOUD_ACCOUNT_HAS_ASSESSMENT: {
    _type: 'lacework_cloud_account_has_assessment',
    sourceType: Entities.CLOUD_ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSESSMENT._type,
  },
  ASSESSMENT_IDENFIED_FINDING: {
    _type: 'lacework_assessment_identified_finding',
    sourceType: Entities.ASSESSMENT._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
  LACEWORK_AWS_ENTITY_HAS_FINDING: {
    _type: 'lacework_aws_entity_has_finding',
    sourceType: Entities.AWS_ENTITY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING._type,
  },
  LACEWORK_AZURE_ENTITY_HAS_FINDING: {
    _type: 'lacework_azure_entity_has_finding',
    sourceType: Entities.AZURE_ENTITY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING._type,
  },
  MACHINE_HAS_FINDING: {
    _type: 'lacework_machine_has_host_vulnerability',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.HOST_VULNERABILITY._type,
  },
};

export const MappedRelationships: Record<
  | 'CLOUD_ACCOUNT_IS_AWS_ACCOUNT'
  | 'LACEWORK_AWS_ENTITY_IS_AWS_ENTITY'
  | 'LACEWORK_AZURE_ENTITY_IS_AZURE_ENTITY',
  StepMappedRelationshipMetadata
> = {
  CLOUD_ACCOUNT_IS_AWS_ACCOUNT: {
    sourceType: Entities.CLOUD_ACCOUNT._type,
    _class: RelationshipClass.IS,
    _type: 'aws_account',
    targetType: Entities.CLOUD_ACCOUNT._type,
    direction: RelationshipDirection.REVERSE,
  },
  LACEWORK_AWS_ENTITY_IS_AWS_ENTITY: {
    _type: 'lacework_aws_entity_is_aws_entity',
    sourceType: Entities.AWS_ENTITY._type,
    _class: RelationshipClass.IS,
    targetType: 'aws_entity',
    direction: RelationshipDirection.REVERSE,
  },
  LACEWORK_AZURE_ENTITY_IS_AZURE_ENTITY: {
    _type: 'lacework_azure_entity_is_azure_entity',
    sourceType: Entities.AZURE_ENTITY._type,
    _class: RelationshipClass.IS,
    targetType: 'azure_entity',
    direction: RelationshipDirection.REVERSE,
  },
};
