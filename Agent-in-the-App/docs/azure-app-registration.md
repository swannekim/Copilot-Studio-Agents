# Microsoft Entra App Registration

Create one SPA app registration for the PCF control.

## Required values

You will paste these into the PCF control properties in Power Apps:

- Application / client ID
- Directory / tenant ID
- Power Platform environment ID
- Copilot Studio agent schema name

## Redirect URIs

Add SPA redirect URIs for the environments where the Canvas App runs, for example:

- `https://runtime-app.powerplatform.com`
- `https://runtime-app.powerplatform.com/control`
- `https://apps.powerapps.com/`
- your Dataverse instance URL, for example `https://org123456.crm.dynamics.com/`
- your authoring island URL, for example `https://authoring.<island>.powerapps.com`
- your authoring island control URL, for example `https://authoring.<island>.powerapps.com/control`

## API permission

Add delegated permission:

- API: Power Platform API
- Permission: `Copilot Studio.Copilots.Invoke`

Then grant admin consent if your tenant requires it.
