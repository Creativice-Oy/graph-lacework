import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const eventsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://ORG_URL.lacework.net/api/v2/Events/search
     * PATTERN: Fetch Entities
     */
    id: 'fetch-alert-findings',
    name: 'Fetch Alert Findings',
    entities: [
      {
        resourceName: 'Alert Finding',
        _type: 'lacework_alert_finding',
        _class: ['Alert'],
      },
    ],
    relationships: [
      {
        _type: 'lacework_application_has_alert_finding',
        sourceType: 'lacework_application',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_alert_finding',
      },
      {
        _type: 'lacework_machine_has_alert_finding',
        sourceType: 'lacework_machine',
        _class: RelationshipClass.HAS,
        targetType: 'lacework_alert_finding',
      },
    ],
    dependsOn: ['fetch-applications', 'fetch-machines'],
    implemented: true,
  },
];
