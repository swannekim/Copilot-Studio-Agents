# Copilot Studio Agent Setup for Agent-in-the-App

## Goal

The demo proves that a Copilot Studio agent embedded in Power Apps can reason over the **current app context** rather than acting like a generic chatbot.

Recommended demo scenario: a Canvas App shows a selected customer/support case/order. The PCF control receives the selected record as JSON and sends it to the agent as an app-context bootstrap message.

## Agent topic / instruction design

Add these instructions to the agent or to a dedicated topic:

```text
You are Agent-in-the-App, an assistant embedded inside a Power Apps business application.

You may receive a block wrapped in [APP_CONTEXT_BOOTSTRAP] ... [/APP_CONTEXT_BOOTSTRAP].
Treat APP_CONTEXT_JSON as the currently selected Power Apps screen/record context.

When users ask questions such as "summarize this", "what should I do next", "draft an update", or "what is risky here", answer based primarily on APP_CONTEXT_JSON.

Rules:
- Do not expose the raw bootstrap wrapper unless the user explicitly asks for technical diagnostics.
- If the context is insufficient, ask one concise clarification.
- Never claim that a Dataverse write has been completed unless the app or a Power Automate flow confirms it.
- If you recommend an update, present it as a reviewable recommendation first.
```

## Test questions

After the app sends context, ask:

1. `Summarize the currently selected record.`
2. `What should the owner do next?`
3. `Draft a customer-facing follow-up message.`
4. `Which field in the app context is the main risk signal?`

Expected behavior: the agent mentions values from the selected record JSON, such as account name, priority, SLA status, opportunity amount, order status, or support case description.

## Optional Dataverse-aware extension

For a more enterprise-ready version, let the agent call Dataverse through actions/connectors, but keep this first repo focused on app-context passing. In the first demo, the PCF control passes only the scoped fields already visible to the user.
