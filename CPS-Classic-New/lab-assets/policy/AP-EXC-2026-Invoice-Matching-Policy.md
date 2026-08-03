# Contoso Manufacturing — Supplier Invoice Matching & Exception Policy

**Policy ID:** AP-EXC-2026
**Owner:** Group Finance, Accounts Payable
**Effective:** 1 January 2026
**Applies to:** All supplier invoices received against a Contoso purchase order

> Upload this document as a **knowledge source** on your agent. It is the single source of
> truth for tolerances and routing. Your agent must not invent rules that are not in here.

---

## 1. Purpose

This policy defines when a supplier invoice may be paid automatically and when it must be
held as an exception for human review. It exists to prevent overpayment, duplicate payment,
and payment to suppliers Contoso is not currently permitted to trade with.

## 2. The three-way match

Every invoice is matched on three documents:

| Document | Source of truth for |
|---|---|
| Supplier invoice | What the supplier is asking to be paid |
| Purchase order (PO) | What Contoso agreed to buy, and at what unit price |
| Goods receipt (GR) | What Contoso actually received |

**Matching is performed line by line, matched on SKU.** A comparison of invoice header
totals against PO header totals is *not* an acceptable substitute: a single badly-priced
line can be hidden inside an otherwise correct total.

## 3. Validation gates

Gates are evaluated **in the order below**. The first gate that fails determines the
exception code. Evaluation stops at the first failure.

### Gate 0 — Intake validation (no ERP lookup required)

| Code | Condition |
|---|---|
| `TOTAL_MISMATCH` | The printed invoice total does not equal the sum of line amounts plus freight, allowing a rounding tolerance of **USD 0.05** |
| `DUPLICATE_INVOICE` | An invoice with the same supplier ID **and** the same supplier invoice number has already been processed and was not rejected |

Gate 0 runs **before** any ERP call. A duplicate must never reach an approver.

### Gate 1 — Master data and policy gates

| Code | Condition |
|---|---|
| `SUPPLIER_NOT_FOUND` | The supplier ID does not exist in the supplier master |
| `SUPPLIER_ON_HOLD` | Supplier status is anything other than `Approved` |
| `PO_NOT_FOUND` | The quoted PO number does not exist |
| `PO_CLOSED` | PO status is not `Open` or `Partially Received` |
| `CURRENCY_MISMATCH` | Invoice currency is not identical to PO currency |
| `GR_MISSING` | No goods receipt has been recorded against the PO |

Currency is compared as an exact string. Contoso does **not** auto-convert currency for
matching purposes; an invoice raised in a different currency to its PO is always an
exception.

### Gate 2 — Line-level three-way match

| Code | Condition |
|---|---|
| `QTY_OVER_RECEIPT` | Invoiced quantity for a line exceeds the quantity received for that line |
| `PRICE_VARIANCE` | Invoiced unit price differs from the PO unit price by **more than 2.00%** *or* the resulting line variance exceeds **USD 50.00** |
| `UNMATCHED_CHARGE` | Charges not attributable to any PO line (freight, handling, surcharges) exceed **USD 100.00** in total across the invoice |

> **Both price tests must pass.** A variance of 1% on a large line can still breach the
> USD 50.00 absolute cap, and a variance of 20% on a very small line can still sit under
> it. Apply the percentage test **and** the absolute test.

There is **no** tolerance on quantity. Contoso never pays for more than it received.

## 4. Outcomes

| Outcome | Meaning |
|---|---|
| `AUTO_CLEAR` | All gates passed. Post for payment without human review. |
| `EXCEPTION` | A gate failed. Hold the invoice and route per section 5. |

## 5. Approval routing

Routing is determined by the exception code and the invoice total.

| Condition | Route | Recommended action |
|---|---|---|
| `DUPLICATE_INVOICE`, `SUPPLIER_ON_HOLD`, `PO_CLOSED`, `CURRENCY_MISMATCH` | AP Manager only | **Reject** |
| Any other exception, invoice total **under USD 10,000** | AP Manager only | Review |
| Any other exception, invoice total **USD 10,000 or above** | AP Manager, then Finance Controller, **in sequence** | Review |

The four codes in the first row are **hard stops**. They are never eligible for a single
automated approval and are never escalated to the Finance Controller — they are rejected at
AP Manager level unless the manager explicitly overrides with a written reason.

Sequential means the Finance Controller is only asked **after** the AP Manager approves.
Parallel approval is not acceptable for high-value exceptions.

## 6. Posting

An invoice may be posted only when:

- the outcome was `AUTO_CLEAR`; **or**
- the outcome was `EXCEPTION` and every required approver approved it.

Every posting must record which of the two paths authorised it, and for approved
exceptions, the identity of the approver.

## 7. Audit requirements

Every invoice processed — cleared, rejected, or still pending — must produce a durable
record containing:

1. Supplier ID and supplier invoice number
2. PO number quoted
3. Invoice currency and total
4. Outcome and, where applicable, the exception code
5. The specific reason, naming the line and the values compared
6. Who approved or rejected it, and when
7. The timestamp the invoice was received and the timestamp it was resolved

A record whose reason reads only "variance found" does not satisfy this policy. The reason
must state the line, the invoiced value, the expected value, and the computed difference.

## 8. Currency

All thresholds in this policy are expressed in **USD**. Where an invoice is raised in another
currency, the `CURRENCY_MISMATCH` gate applies before any threshold is evaluated, so no
conversion is required for matching.
