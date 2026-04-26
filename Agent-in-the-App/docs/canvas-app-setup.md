# Canvas App Wiring

## Enable PCF for Canvas Apps

In the target Power Platform environment, enable code components for Canvas Apps if it is not already enabled.

## Add the control

1. Import the PCF solution generated from this repo.
2. Open or create a Canvas App.
3. Insert the `Agent in the App` code component.
4. Bind the properties below.

## Example screen structure

Create a simple app with:

- Left panel: Gallery of mock accounts/cases/orders
- Middle panel: Form/detail card showing the selected record
- Right panel: `Agent in the App` PCF control

## Example formula for `appContextJson`

For a selected support case gallery named `galCases`:

```powerfx
JSON(
    {
        appName: "Agent-in-the-App Demo",
        screenName: App.ActiveScreen.Name,
        selectedCaseId: galCases.Selected.CaseId,
        customerName: galCases.Selected.CustomerName,
        priority: galCases.Selected.Priority,
        status: galCases.Selected.Status,
        slaRisk: galCases.Selected.SlaRisk,
        issueSummary: galCases.Selected.IssueSummary,
        lastContactDate: Text(galCases.Selected.LastContactDate, "yyyy-mm-dd"),
        currentUser: User().Email
    },
    JSONFormat.Compact
)
```

## Required PCF properties

```powerfx
agentTitle       = "Case Copilot"
appClientId      = "<Entra app client id>"
tenantId         = "<tenant id>"
environmentId    = "<Power Platform environment id>"
agentIdentifier  = "<Copilot Studio schema name>"
username         = User().Email
appContextJson   = <formula above>
autoSendContext  = true
```

## Optional output usage

Add a text label outside the chat:

```powerfx
AgentInTheApp.response
```

This proves the app can receive the latest agent response back from the PCF control and use it elsewhere in the screen.
