import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const assessmentSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL/api/v2/Reports?primaryQueryId={PRIMARY_QUERY_ID}
     *           &secondaryQueryId={SECONDARY_QUERY_ID}
     *           &format=json&reportType={REPORT_TYPE}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-assessments',
    name: 'Fetch Assessments',
    entities: [
      {
        resourceName: 'Assessment',
        _type: 'lacework_assessment',
        _class: ['Assessment'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-cloud-accounts'],
    implemented: true,
  },
];
