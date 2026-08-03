# Exception ledger — table schema

The agent must write one row per invoice processed. Build this as a **Dataverse table**
(preferred) or a **SharePoint list** (fallback). Both schemas below are equivalent.

---

## Option A — Dataverse table (preferred)

**Table display name:** `Invoice Exception`
**Plural:** `Invoice Exceptions`
**Primary column:** `Invoice Key` (text)

| Display name | Data type | Notes |
|---|---|---|
| Invoice Key | Text (100) | Primary column. `<supplierId>:<supplierInvoiceNumber>`, e.g. `SUP-1001:INV-2026-0001`. Makes duplicate detection a single lookup. |
| Supplier Invoice Number | Text (60) | As printed by the supplier |
| Supplier ID | Text (20) | e.g. `SUP-1001` |
| Supplier Name | Text (200) | |
| PO Number | Text (20) | As quoted on the invoice, even if it turns out not to exist |
| Invoice Date | Date only | |
| Currency | Text (3) | ISO 4217 |
| Invoice Total | Currency | Stated total from the invoice |
| Outcome | Choice | `Auto cleared`, `Exception - pending approval`, `Exception - approved`, `Exception - rejected` |
| Exception Code | Choice | `TOTAL_MISMATCH`, `DUPLICATE_INVOICE`, `SUPPLIER_NOT_FOUND`, `SUPPLIER_ON_HOLD`, `PO_NOT_FOUND`, `PO_CLOSED`, `CURRENCY_MISMATCH`, `GR_MISSING`, `QTY_OVER_RECEIPT`, `PRICE_VARIANCE`, `UNMATCHED_CHARGE` |
| Exception Value | Currency | The money at risk — the computed variance, or the invoice total for hard stops |
| Reason | Multiline text (2000) | Must name the line, the invoiced value, the expected value and the difference |
| Approver Route | Text (200) | e.g. `AP Manager` or `AP Manager -> Finance Controller` |
| Approved By | Text (200) | Email of the approver who resolved it |
| Approval Comments | Multiline text (1000) | |
| Received At | Date and time | When the invoice entered the process |
| Resolved At | Date and time | When it was posted or rejected |
| Posting ID | Text (40) | Returned by the ERP on successful posting |

### Build steps

1. Go to **make.powerapps.com** → your environment → **Tables** → **New table** →
   **Start from blank**.
2. Set the display name to `Invoice Exception`. Expand **Advanced options** and confirm
   the primary column display name is `Invoice Key`.
3. Add each column above with **+ New column**. For the two Choice columns, add the
   listed values as a **local choice** on the column.
4. Save. Note the logical name Dataverse generates (it will carry your solution's
   publisher prefix, e.g. `cr123_invoiceexception`) — the connector actions reference it.

> **Choice column gotcha:** *multi-select* choice columns cannot be populated by the
> Excel/CSV import path. Both choice columns here are single-select, so import works — but
> if you add your own multi-select column later, expect the import to fail on it.

### Why a `Invoice Key` primary column

Duplicate detection is the first gate in the policy and it runs on every single invoice.
Concatenating supplier and invoice number into one indexed text column turns that gate
into one cheap lookup instead of a filtered query across two columns.

---

## Option B — SharePoint list (fallback)

Use this if your environment has no Dataverse database.

**List name:** `Invoice Exceptions`

| Column | Type | Notes |
|---|---|---|
| Title | Single line of text | Use for `Invoice Key` |
| SupplierInvoiceNumber | Single line of text | |
| SupplierId | Single line of text | |
| SupplierName | Single line of text | |
| PONumber | Single line of text | |
| InvoiceDate | Date and time (date only) | |
| Currency | Single line of text | |
| InvoiceTotal | Currency | |
| Outcome | Choice | Same four values as above |
| ExceptionCode | Choice | Same eleven values as above |
| ExceptionValue | Currency | |
| Reason | Multiple lines of text (plain) | |
| ApproverRoute | Single line of text | |
| ApprovedBy | Person or Group | |
| ApprovalComments | Multiple lines of text (plain) | |
| ReceivedAt | Date and time | |
| ResolvedAt | Date and time | |
| PostingId | Single line of text | |

### Build steps

1. In your SharePoint site: **New** → **List** → **Blank list**, name it
   `Invoice Exceptions`.
2. Add each column above. Set **Multiple lines of text** columns to **Plain text**, not
   Enhanced rich text — rich text arrives in flows wrapped in HTML and is painful to read
   in an approval card.
3. Rename the default `Title` column to `Invoice Key` via **List settings** → **Title** →
   **Column name** (the internal name stays `Title`, which is what flows bind to).

> **Trade-off:** the SharePoint path is quicker to stand up, but you lose Dataverse's
> choice-column validation, relationship support, and the ability to use the table as a
> Copilot Studio knowledge source with Dataverse search. Prefer Dataverse if it is
> available to you.

---

## Seeding reference data

The supplier, PO and goods-receipt data lives in the ERP mock, not in this table. This
table only records what the agent decided. Do **not** copy the ERP data into Dataverse —
part of the exercise is calling a system you do not own.
