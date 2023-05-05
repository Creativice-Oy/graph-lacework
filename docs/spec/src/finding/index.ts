import { StepSpec, RelationshipClass } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL/api/v2/Reports?primaryQueryId={PRIMARY_QUERY_ID}
     *           &secondaryQueryId={SECONDARY_QUERY_ID}
     *           &format=json&reportType={REPORT_TYPE}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-findings',
    name: 'Fetch Findings',
    entities: [
      {
        resourceName: 'Finding',
        _type: 'lacework_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_assessment_identified_finding',
        sourceType: 'lacework_assessment',
        _class: RelationshipClass.IDENTIFIED,
        targetType: 'lacework_finding',
      },
    ],
    dependsOn: ['fetch-assessments'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Relationships
     */
    id: 'build-lacework-aws-entity-finding-relationship',
    name: 'Build Lacework AWS Entity and Finding Relationship',
    entities: [
      {
        resourceName: 'AWS Entity',
        _type: 'lacework_aws_entity',
        _class: ['Entity'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_aws_entity_has_finding',
        sourceType: 'lacework_aws_entity',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_finding',
      },
    ],
    dependsOn: ['fetch-findings'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Relationships
     */
    id: 'build-lacework-aws-entity-aws-entity-relationship',
    name: 'Build Lacework AWS Entity and AWS Entity Relationship',
    entities: [],
    relationships: [
      {
        _type: 'lacework_aws_entity_is_aws_entity',
        sourceType: 'lacework_aws_entity',
        _class: RelationshipClass.IS,
        targetType: 'aws_entity',
      },
    ],
    dependsOn: ['build-lacework-aws-entity-finding-relationship'],
    implemented: true,
  },

  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Relationships
     */
    id: 'build-lacework-azure-entity-finding-relationship',
    name: 'Build Lacework Azure Entity and Finding Relationship',
    entities: [
      {
        resourceName: 'Azure Entity',
        _type: 'lacework_azure_entity',
        _class: ['Entity'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_azure_entity_has_finding',
        sourceType: 'lacework_azure_entity',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_finding',
      },
    ],
    dependsOn: ['fetch-findings'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Relationships
     */
    id: 'build-lacework-azure-entity-azure-entity-relationship',
    name: 'Build Lacework Azure Entity and Azure Entity Relationship',
    entities: [],
    relationships: [
      {
        _type: 'lacework_azure_entity_is_azure_entity',
        sourceType: 'lacework_azure_entity',
        _class: RelationshipClass.IS,
        targetType: 'azure_entity',
      },
    ],
    dependsOn: ['build-lacework-azure-entity-finding-relationship'],
    implemented: true,
  },
];
