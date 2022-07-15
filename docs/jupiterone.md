# Lacework Integration with JupiterOne

## Lacework + JupiterOne Integration Benefits

- Visualize Lacework services, teams, and users in the JupiterOne graph.
- Map Lacework users to employees in your JupiterOne account.
- Monitor changes to Lacework users using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches organizations, users, assessments and findings
  from Lacework to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

- Lacework supports Bearer Authentication. You must have a Administrator user
  account.
- JupiterOne requires a REST API key. You need permission to create a user in
  Lacework that will be used to obtain the Bearer tokens.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In Lacework

1. [Generate a REST API key](https://example.com/docs/generating-api-keys)

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Lacework** integration tile and click it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this Lacework
  account in JupiterOne. Ingested entities will have this value stored in
  `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- {{additional provider-specific settings}} Enter the **Lacework API Key**
  generated for use by JupiterOne.

4. Click **Create Configuration** once all values are provided.

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Lacework** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources     | Entity `_type`           | Entity `_class` |
| ------------- | ------------------------ | --------------- |
| Alert Finding | `lacework_alert_finding` | `Alert`         |
| Application   | `lacework_application`   | `Application`   |
| Assessment    | `lacework_assessment`    | `Assessment`    |
| Cloud Account | `lacework_cloud_account` | `Account`       |
| Machine       | `lacework_machine`       | `Host`          |
| Organization  | `lacework_organization`  | `Account`       |
| Package       | `lacework_package`       | `CodeModule`    |
| Service       | `lacework_service`       | `Service`       |
| Team Member   | `lacework_team_member`   | `User`          |
| Vulnerability | `lacework_finding`       | `Finding`       |

### Relationships

The following relationships are created:

| Source Entity `_type`   | Relationship `_class` | Target Entity `_type`    |
| ----------------------- | --------------------- | ------------------------ |
| `lacework_application`  | **HAS**               | `lacework_alert_finding` |
| `lacework_assessment`   | **IDENTIFIED**        | `lacework_finding`       |
| `lacework_machine`      | **HAS**               | `lacework_alert_finding` |
| `lacework_machine`      | **HAS**               | `lacework_application`   |
| `lacework_machine`      | **HAS**               | `lacework_finding`       |
| `lacework_organization` | **HAS**               | `lacework_application`   |
| `lacework_organization` | **HAS**               | `lacework_cloud_account` |
| `lacework_organization` | **HAS**               | `lacework_machine`       |
| `lacework_organization` | **HAS**               | `lacework_package`       |
| `lacework_organization` | **HAS**               | `lacework_service`       |
| `lacework_organization` | **HAS**               | `lacework_team_member`   |
| `lacework_service`      | **PERFORMED**         | `lacework_assessment`    |

### Mapped Relationships

The following mapped relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `lacework_finding`    | **IS**                | `*cve*`               | FORWARD   |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
