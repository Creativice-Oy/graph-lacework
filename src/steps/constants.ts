import {
  RelationshipClass,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const ORGANIZATION_ENTITY_DATA_KEY = 'entity:organization';
export const SERVICE_ENTITY_DATA_KEY = 'entity:service';

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

export const Steps = {
  ORGANIZATION: 'fetch-organization',
  SERVICE: {
    id: 'fetch-service',
    name: 'Fetch Service',
  },
  TEAM_MEMBERS: 'fetch-team-members',
  ACCOUNTS: {
    id: 'fetch-cloud-accounts',
    name: 'Fetch Cloud Accounts',
  },
  CLOUD_RESOURCES: {
    id: 'fetch-cloud-resources',
    name: 'Fetch Cloud Resources',
  },
  ASSESSMENTS: {
    id: 'fetch-assessments',
    name: 'Fetch Assessments',
  },
  CLOUD_VULNERABILITIES: {
    id: 'fetch-cloud-vulnerabilities',
    name: 'Fetch Cloud Vulnerabilities',
  },
  MACHINES: {
    id: 'fetch-machines',
    name: 'Fetch Machines',
  },
  PACKAGES: {
    id: 'fetch-packages',
    name: 'Fetch Packages',
  },
  APPLICATIONS: {
    id: 'fetch-applications',
    name: 'Fetch Applications',
  },
  ALERT_FINDINGS: {
    id: 'fetch-alert-findings',
    name: 'Fetch Alert Findings',
  },
  HOST_VULNERABILITIES: {
    id: 'fetch-host-vulnerabilities',
    name: 'Fetch Host vulnerabilities',
  },
  MACHINE_APPLICATION_RELATIONSHIP: {
    id: 'build-machine-application-relationships',
    name: 'Build Machine and Application Relationship',
  },
  VULNERABILITY_CVE_RELATIONSHIP: {
    id: 'build-vulnerability-cve-relationship',
    name: 'Build Vulnerability and CVE Relationship',
  },
};

export const Entities: Record<
  | 'ORGANIZATION'
  | 'SERVICE'
  | 'TEAM_MEMBER'
  | 'ASSESSMENT'
  | 'CLOUD_ACCOUNT'
  | 'MACHINE'
  | 'PACKAGE'
  | 'APPLICATION'
  | 'ALERT_FINDING'
  | 'VULNERABILITY',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'lacework_organization',
    _class: ['Account'],
  },
  SERVICE: {
    resourceName: 'Service',
    _type: 'lacework_service',
    _class: ['Service'],
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
  MACHINE: {
    resourceName: 'Machine',
    _type: 'lacework_machine',
    _class: ['Host'],
  },
  PACKAGE: {
    resourceName: 'Package',
    _type: 'lacework_package',
    _class: ['CodeModule'],
  },
  APPLICATION: {
    resourceName: 'Application',
    _type: 'lacework_application',
    _class: ['Application'],
  },
  ALERT_FINDING: {
    resourceName: 'Alert Finding',
    _type: 'lacework_alert_finding',
    _class: ['Alert'],
  },
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'lacework_finding',
    _class: ['Finding'],
  },
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_SERVICE'
  | 'ORGANIZATION_HAS_TEAM_MEMBER'
  | 'ORGANIZATION_HAS_CLOUD_ACCOUNT'
  | 'ORGANIZATION_HAS_MACHINE'
  | 'ORGANIZATION_HAS_PACKAGE'
  | 'ORGANIZATION_HAS_APPLICATION'
  | 'MACHINE_HAS_PACKAGE'
  | 'MACHINE_HAS_APPLICATION'
  | 'MACHINE_HAS_ALERT_FINDING'
  | 'APPLICATION_HAS_ALERT_FINDING'
  | 'SERVICE_PERFORMED_ASSESSMENT'
  | 'CLOUD_ACCOUNT_HAS_ASSESSMENT'
  | 'ASSESSMENT_IDENTIFIED_VULNERABILITY'
  | 'MACHINE_HAS_VULNERABILITY'
  | 'PACKAGE_HAS_VULNERABILITY',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_SERVICE: {
    _type: 'lacework_organization_has_service',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SERVICE._type,
  },
  ORGANIZATION_HAS_TEAM_MEMBER: {
    _type: 'lacework_organization_has_team_member',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM_MEMBER._type,
  },
  ORGANIZATION_HAS_CLOUD_ACCOUNT: {
    _type: 'lacework_organization_has_cloud_account',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CLOUD_ACCOUNT._type,
  },
  ORGANIZATION_HAS_MACHINE: {
    _type: 'lacework_organization_has_machine',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.MACHINE._type,
  },
  ORGANIZATION_HAS_PACKAGE: {
    _type: 'lacework_organization_has_package',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PACKAGE._type,
  },
  MACHINE_HAS_PACKAGE: {
    _type: 'lacework_machine_has_package',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PACKAGE._type,
  },
  ORGANIZATION_HAS_APPLICATION: {
    _type: 'lacework_organization_has_application',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.APPLICATION._type,
  },
  MACHINE_HAS_APPLICATION: {
    _type: 'lacework_machine_has_application',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.APPLICATION._type,
  },
  MACHINE_HAS_ALERT_FINDING: {
    _type: 'lacework_machine_has_alert_finding',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ALERT_FINDING._type,
  },
  APPLICATION_HAS_ALERT_FINDING: {
    _type: 'lacework_application_has_alert_finding',
    sourceType: Entities.APPLICATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ALERT_FINDING._type,
  },
  SERVICE_PERFORMED_ASSESSMENT: {
    _type: 'lacework_service_performed_assessment',
    sourceType: Entities.SERVICE._type,
    _class: RelationshipClass.PERFORMED,
    targetType: Entities.ASSESSMENT._type,
  },
  CLOUD_ACCOUNT_HAS_ASSESSMENT: {
    _type: 'lacework_cloud_account_has_assessment',
    sourceType: Entities.CLOUD_ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSESSMENT._type,
  },
  ASSESSMENT_IDENTIFIED_VULNERABILITY: {
    _type: 'lacework_assessment_identified_finding',
    sourceType: Entities.ASSESSMENT._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.VULNERABILITY._type,
  },
  MACHINE_HAS_VULNERABILITY: {
    _type: 'lacework_machine_has_finding',
    sourceType: Entities.MACHINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.VULNERABILITY._type,
  },
  PACKAGE_HAS_VULNERABILITY: {
    _type: 'lacework_package_has_finding',
    sourceType: Entities.PACKAGE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.VULNERABILITY._type,
  },
};

export const MappedRelationships: Record<
  'VULNERABILITY_IS_CVE',
  StepMappedRelationshipMetadata
> = {
  VULNERABILITY_IS_CVE: {
    _type: 'lacework_finding_is_cve',
    sourceType: Entities.VULNERABILITY._type,
    _class: RelationshipClass.IS,
    targetType: 'cve',
    direction: RelationshipDirection.FORWARD,
  },
};
