# Model-driven App Option

This repo chooses Canvas App first because the public PCF Canvas sample path is the most direct way to show app-context passing and bidirectional communication.

For a model-driven app, the more native contextual architecture is:

1. Add a PCF control to the form.
2. Read the current Dataverse record context from the PCF runtime.
3. Invoke Copilot Studio through Agent APIs or `Xrm.Copilot.executeEvent()` where available.
4. Render recommendations inside the form.
5. Require explicit human confirmation before any Dataverse writeback.

This is attractive for form-level enterprise decision support, but the `Xrm.Copilot` client API is preview, so Canvas App + PCF is safer for a repeatable demo.
