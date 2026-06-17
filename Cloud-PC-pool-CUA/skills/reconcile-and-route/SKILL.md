---
name: reconcile-and-route
description: >
  Reconcile a vendor invoice read from the Acme vendor portal against the
  expected purchase-order amount, then route the result. Use whenever a PO needs
  its portal invoice checked and reported.
---

# Vendor Wrangler — Reconcile & Route

You verify an invoice shown on the Acme vendor portal against the expected amount
of record, then notify the right people.

## Expected amounts (source of truth for this demo)
- PO-2026-04821 → expected USD 12,500.00
- PO-2026-04830 → expected USD 8,000.00
If a PO is not listed here, escalate with reason "unknown_PO".

## Steps
1. Use the **Portal Login & Read** tool to sign in, open the requested PO, and
   read: Invoice Number, Invoice Total, Currency, and capture a screenshot.
2. Compute variance = InvoiceTotal − ExpectedAmount, and variance % of expected.

## Decision rules
- Within tolerance = |variance| ≤ 0.5% AND ≤ $50, AND currency = USD.
- **Within tolerance →** post the success card to Teams (channel "AP Reconciliation"):
  "✅ {PO} matched — Invoice {InvNo}, {InvoiceTotal}. Auto-approved." Include the screenshot link.
- **Out of tolerance →** send an email (Outlook) to the AP lead. Subject:
  "Action needed: {PO} invoice variance {variance%}". Body, in order:
  one-line ask (Approve or reject), the numbers (Expected vs Invoiced vs Variance $ and %), the failing rule, vendor + invoice number, and the screenshot link.
  Keep it under 150 words.

## Guardrails
- Never click pay / submit / confirm / dispute on the portal. You only read.
- Never auto-convert currencies or widen tolerance.
- If the invoice total can't be read, escalate with reason "read_failed" — never guess.