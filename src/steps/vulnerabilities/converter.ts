import {
  createIntegrationEntity,
  Entity,
  Relationship,
  createMappedRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities, MappedRelationships } from '../constants';
import { LaceworkHostVulnerability } from '../../types';

const SEVERITY_TO_NUMERIC_SEVERITY_MAP = new Map<string, number>([
  ['info', 1],
  ['low', 2],
  ['medium', 5],
  ['high', 7],
  ['critical', 10],
]);

const NUMERIC_SEVERITY_TO_SEVERITY_MAP = new Map<number, string>([
  [1, 'info'],
  [2, 'low'],
  [3, 'medium'],
  [4, 'high'],
  [5, 'critical'],
]);

export function getNumericSeverityFromIssueSeverity(
  issueSeverity?: 'low' | 'medium' | 'high' | 'critical',
): number {
  if (!issueSeverity) return 0;

  const numericSeverity = SEVERITY_TO_NUMERIC_SEVERITY_MAP.get(issueSeverity);
  return numericSeverity === undefined ? 0 : numericSeverity;
}

export function getIssueSeverityFromNumericSeverity(numericSeverity): string {
  if (!numericSeverity) return 'Undefined';

  const issueSeverity = NUMERIC_SEVERITY_TO_SEVERITY_MAP.get(numericSeverity);
  return issueSeverity === undefined ? 'Undefined' : issueSeverity;
}

/* Cloud Vulnerabilities */
export function getCloudVulnerabilityKey(
  recId: string,
  service: string,
): string {
  return `lacework_cloud_finding:${recId}:${service}`;
}

export function createCloudVulnerabilityEntity(vulnerability: any): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vulnerability,
      assign: {
        _key: getCloudVulnerabilityKey(
          vulnerability.REC_ID,
          vulnerability.SERVICE,
        ),
        _type: Entities.VULNERABILITY._type,
        _class: Entities.VULNERABILITY._class,
        category: vulnerability.category || 'Cloud Entity',
        severity: getIssueSeverityFromNumericSeverity(vulnerability.severity),
        numericSeverity: vulnerability.severity || 1,
        open: true,
        name: vulnerability.REC_ID,
      },
    },
  });
}

/* Host Vulnerability */
export function getHostVulnerabilityFeatureString(feature: any): string {
  return `${feature.name}_${feature.namespace}_${feature.version_installed}`;
}

export function getHostVulnerabilityKey(
  hostname: string,
  vulnId: string,
  feature: any,
): string {
  return `lacework_host_finding:${hostname}_${vulnId}_${getHostVulnerabilityFeatureString(
    feature,
  )}`;
}

export function createHostVulnerabilityEntity(
  hostVulnerability: LaceworkHostVulnerability,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: hostVulnerability,
      assign: {
        _key: getHostVulnerabilityKey(
          hostVulnerability.machineTags.Hostname,
          hostVulnerability.vulnId,
          hostVulnerability.featureKey,
        ),
        _type: Entities.VULNERABILITY._type,
        _class: Entities.VULNERABILITY._class,
        category: 'Machine',
        severity: hostVulnerability.severity,
        blocking: false,
        open: true,
        production: true,
        public: true,
        numericSeverity: getNumericSeverityFromIssueSeverity(
          hostVulnerability.severity.toLowerCase(),
        ),
        weblink: hostVulnerability.cveProps.link,
        name: hostVulnerability.vulnId || 'default',
        hostname: hostVulnerability.machineTags.Hostname,
      },
    },
  });
}

export function createFindingCveRelationship(
  finding: Entity,
  cveId: string,
  options?: {
    severity: string;
  },
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: MappedRelationships.VULNERABILITY_IS_CVE._type,
    _mapping: {
      sourceEntityKey: finding._key,
      relationshipDirection: MappedRelationships.VULNERABILITY_IS_CVE.direction,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _class: 'Vulnerability',
        _type: 'cve',
        _key: cveId.toLowerCase(),
        name: cveId,
        displayName: cveId,
        severity: options?.severity || 'unknown',
        references: [`https://nvd.nist.gov/vuln/detail/${cveId}`],
        webLink: `https://nvd.nist.gov/vuln/detail/${cveId}`,
      },
      skipTargetCreation: false,
    },
  });
}
