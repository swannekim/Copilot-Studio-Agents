# Hands-On Lab (L200–L300): Contoso AP Invoice Checker

**Prerequisite:** You have completed the introductory Copilot Studio session.

> 📌 This is the **guided** version of the Contoso AP lab. You are given the flow structure and told which rules to implement.

---

## 1. What you are building

Contoso Manufacturing's accounts payable team opens supplier invoices by hand, finds the matching purchase order, checks the price and quantity, and then either pays the invoice or emails someone about it. Most invoices are fine. A few are not, and those are where money is lost.

You will build an agent that reads an invoice, checks it against Contoso's ERP, and decides whether it can be paid automatically or needs a human.

By the end you will have used:

- **AI Builder** to read the invoice PDF
- A **custom connector** to query the ERP
- An **agent flow** to hold the checking logic
- **Dataverse** to record what happened
- A **classic Copilot Studio agent** to tie it together

Then you will rebuild the same idea in the **new experience** using a **Workflow with an Agent node**, so you can feel the difference.

---

## 2. The rules you must implement

All from Contoso policy **AP-EXC-2026** (`policy/AP-EXC-2026-Invoice-Matching-Policy.md`). This lab uses **six** of its checks. Run them **in this order** and **stop at the first failure**.

| Order | Check | Exception code | Rule |
|---|---|---|---|
| 1 | Invoice adds up | `TOTAL_MISMATCH` | The printed total differs from the printed subtotal by more than **USD 0.05** |
| 2 | Not a duplicate | `DUPLICATE_INVOICE` | This invoice number is already in the ledger |
| 3 | PO exists | `PO_NOT_FOUND` | The ERP returns **404** for the quoted PO number |
| 4 | Supplier approved | `SUPPLIER_ON_HOLD` | Supplier status is anything other than `Approved` |
| 5 | Quantity | `QTY_OVER_RECEIPT` | Invoiced quantity is greater than the quantity actually received |
| 6 | Price | `PRICE_VARIANCE` | Invoiced unit price differs from the PO price by more than **2%** *or* by more than **USD 50.00** on that line |

If all six pass, the outcome is **`AUTO_CLEAR`**. Otherwise it is **`EXCEPTION`** with the code of the first check that failed, and it goes to the **AP Manager** for approval.

> **Order matters.** `INV-2026-0007` matches perfectly on price and quantity, but the supplier is on hold. If you check the supplier *after* matching, you will report it as clean and Contoso pays a supplier it is not allowed to pay.

> **Both price tests apply.** A line can be under 2% and still breach the USD 50 cap, or over 2% and still be small. Check both.

---

## 3. Before you start

Your facilitator has already deployed the **ERP mock**. You need from them:

- the **host name** of the ERP mock
- the **API key**

If you also want to stand up your own mock, the instructions are in the L300–L400 brief. Not required here.

Everything else is in the `lab-assets` folder:

| Path | What it is |
|---|---|
| `invoices/*.pdf` | Supplier invoices. You will use **eight** of them — see §9 |
| `api/contoso-erp-openapi.json` | The connector definition you will import |
| `policy/AP-EXC-2026-Invoice-Matching-Policy.md` | The full policy. This lab uses the six checks in §2 |
| `schemas/exception-ledger-schema.md` | The full ledger schema. This lab uses a shorter version — see §5 |

---

## 4. Step 1 — Import the custom connector

1. Go to **make.powerapps.com** → select your environment → **Data** → **Custom connectors**.
2. **+ New custom connector** → **Import an OpenAPI file**.
3. Name it `Contoso ERP`, choose `api/contoso-erp-openapi.json`, select **Continue**.
4. On the **General** page, set **Host** to the host name your facilitator gave you.
5. On the **Security** page, leave the API key settings as they are.
6. Select **Create connector**.
7. **Wait two or three minutes.** The connector is not ready immediately, and testing too early fails in a confusing way.
8. Go to the **Test** page → **New connection** → enter the API key from your facilitator → **Create connection**.
9. Return to **Test**, refresh the connection list, select the **`GetPurchaseOrder`** operation, type `PO-45001` into the **Purchase order number** field, and select **Test operation**.

You should get back supplier `SUP-1001`, status `Partially Received`, and two lines.

Now test the failure path — run `GetPurchaseOrder` again with **`PO-99999`**. You should get **404**. That is not a bug; one of your invoices quotes a PO that does not exist, and your flow has to handle it.

> `PO-45001` is a purchase order **number** you type into a field, not a file. There are no PO files in this pack — purchase orders live in the ERP and are fetched through the connector.

---

## 5. Step 2 — Create the ledger table

In **make.powerapps.com** → **Tables** → **New table** → **Start from blank**. Name it `Invoice Check`.

Add these columns:

| Column | Type |
|---|---|
| Invoice Number | Text — use this as the primary column |
| Supplier Name | Text |
| PO Number | Text |
| Invoice Total | Currency |
| Outcome | Choice: `Auto cleared`, `Exception` |
| Exception Code | Text |
| Reason | Multiline text |
| Checked At | Date and time |

Every invoice you process gets a row here — including the ones that pass. A log that only records failures is not a log.

---

## 6. Step 3 — Build the agent flow

In Copilot Studio, classic experience: **Workflows** → **New agent flow**.

The designer opens with the trigger and response already in place. Build between them.

### 6.1 Trigger

**When an agent calls the flow.** Add one input of type **File**, named `Invoice`.

### 6.2 Read the invoice — AI Builder

Add an action: search for **AI Builder**, choose **Extract information from invoices**.

Set **Invoice file** to the `Invoice` input from the trigger.

This is a model Microsoft trained specifically on invoices. It gives you back, among other fields:

| You need | AI Builder gives you |
|---|---|
| Invoice number | `Invoice ID` |
| PO number | `Purchase order` |
| Supplier name | `Vendor name` |
| Subtotal | `Subtotal (number)` |
| Total | `Invoice total (number)` |
| Line items | `Product code`, `Quantity`, `Unit price`, `Amount` |

Every field also comes with a **confidence score** between 0 and 1 — how sure the model is. You are not required to use them in this lab, but look at them while testing. A field returned at 0.4 confidence is one you would not want to pay money against without a human checking.

> Use the **number** versions of amounts, not the text versions. `Invoice total (number)` gives you `1380.00`. `Invoice total (text)` gives you `"$1380.00"`, which you cannot do arithmetic with.

### 6.3 Check 1 — does the invoice add up?

Add a **Condition**: is the absolute difference between `Invoice total (number)` and `Subtotal (number)` greater than `0.05`?

If **yes** → this is `TOTAL_MISMATCH`. Skip to writing the verdict.

> Why 0.05 and not 0? Because rounding exists. One invoice in your test set is out by exactly one cent and must still be treated as fine.

### 6.4 Check 2 — have we seen this invoice before?

Add a Dataverse action: **List rows** on `Invoice Check`, filtering on the invoice number returned by AI Builder.

If a row comes back → `DUPLICATE_INVOICE`.

> Do this **before** calling the ERP. A duplicate should never reach an approver — it has already been dealt with once.

### 6.5 Check 3 — does the PO exist?

Add your **Contoso ERP** connector action **GetPurchaseOrder**, passing the `Purchase order` value from AI Builder.

Handle the 404. A missing PO is a **business outcome** (`PO_NOT_FOUND`), not a crash. Your flow must keep running and report it.

### 6.6 Check 4 — is the supplier approved?

Add the connector action **GetSupplier**, using the `supplierId` **from the purchase order response** you just received.

> The supplier code is not printed on the invoice — only the supplier's name is. That is why you fetch the PO first and read the supplier code from it.

If the returned `status` is not `Approved` → `SUPPLIER_ON_HOLD`.

### 6.7 Checks 5 and 6 — quantity and price

Add an **Apply to each** over the invoice line items from AI Builder. For each line, find the PO line with the same **SKU** (`Product code`), then:

- If invoiced **quantity** is greater than the PO line's **`qtyReceived`** → `QTY_OVER_RECEIPT`
- If the invoiced **unit price** differs from the PO line's **`unitPrice`**:
  - by more than **2%**, **or**
  - by more than **USD 50.00** across that line's quantity

  → `PRICE_VARIANCE`

> Compare against **`qtyReceived`**, not `qtyOrdered`. Contoso pays for what arrived, not what was ordered. One invoice in your set is built to catch exactly this.

### 6.8 Write the verdict and the ledger row

Build a verdict with these fields, then create a row in `Invoice Check`:

```
outcome        AUTO_CLEAR or EXCEPTION
exceptionCode  the code of the first failed check, or empty
reason         which line, what was invoiced, what was expected
```

A reason of `"variance found"` is not good enough. Write it so a finance person could act on it without opening anything else:

> `Line 1 (TL-FRT-STD): invoiced 415.80 against PO price 385.00 — 8.00% over.`

### 6.9 Respond to the agent

The **Respond to the agent** action returns the verdict. Send back `outcome`, `exceptionCode` and `reason` as separate outputs.

Then **save and publish** the flow. A flow that is not published cannot be used as a tool.

---

## 7. Step 4 — Build the agent

Copilot Studio, classic experience: create a new agent named `Contoso AP Agent`.

1. **Knowledge** — upload `policy/AP-EXC-2026-Invoice-Matching-Policy.md`. This lets the agent explain a rule when someone asks why an invoice was held. It does **not** do the checking; your flow does that.
2. **Tools** — **Add a tool** → your published agent flow. Give it a clear name like `Check supplier invoice` and a description like *"Checks a supplier invoice against its purchase order and returns whether it can be paid automatically."*
3. **Instructions** — tell the agent to use the tool whenever a user provides an invoice, and to report the outcome, the code and the reason back in plain language.

> Under generative orchestration, the agent picks tools from their **name and description**. `Check supplier invoice` gets chosen. `Flow 1` does not. Names carry more weight than descriptions, so spend a moment on them.

**Do not put the tolerance numbers in the agent's instructions.** The 2%, the USD 50, the USD 0.05 all live in the flow. Instructions are not a control an auditor can inspect, and a model can talk itself out of them.

---

## 8. Step 5 — Do it again in the new experience

Same idea, different building blocks. This part is shorter — you are not rebuilding the whole thing, just the extraction and decision path.

In Copilot Studio, switch on **New experience** (or **Try it now** from the classic home page), then **Workflows** → **New workflow**.

Build this:

| Node | What it does |
|---|---|
| **Trigger** | Manual, or when an email arrives |
| **Agent node** — choose **New agent for this workflow** | Reads the invoice. Set **Output** to **Custom structured output** and define fields: `invoiceNumber`, `poNumber`, `subtotal`, `invoiceTotal`, `lines` |
| **Ordinary workflow nodes** | The six checks from §2. Same rules, same order |
| **Connector nodes** | `GetPurchaseOrder`, then `GetSupplier` |
| **Agent node** — second one | Turns the verdict into a sentence a human can act on |
| **Condition** | Branch on `outcome` |

Test each node on its own with **Test this node** before running the whole thing. That is one of the genuinely nicer things about the new designer.

### AI Builder and the Agent node are not the same thing

Worth being precise about, because they look similar:

| | AI Builder invoice model | Agent node |
|---|---|---|
| What it is | A model trained on invoices specifically | A general AI step you instruct in natural language |
| Where it runs | An action inside a flow | A node inside a new-experience workflow |
| Output | A fixed, documented list of fields | Whatever shape you define |
| Confidence scores | **Yes, per field** | No |
| Best at | Standard commercial documents | Anything, if you describe it well |

In Part A you used the specialist. In Part B you use the generalist and tell it what you want. Both are valid; notice which one gave you more reliable field names and which gave you more flexibility.

---

## 9. Your test set

Run these **eight** invoices, in this order, and record what your agent decided.

| # | Invoice | What to record |
|---|---|---|
| 1 | `INV-2026-0001` | outcome, code, reason |
| 2 | `INV-2026-0003` | outcome, code, reason |
| 3 | `INV-2026-0004` | outcome, code, reason |
| 4 | `INV-2026-0005` | outcome, code, reason |
| 5 | `INV-2026-0007` | outcome, code, reason |
| 6 | `INV-2026-0014` | outcome, code, reason |
| 7 | `INV-2026-0015` | outcome, code, reason |
| 8 | `INV-2026-0001-DUPLICATE` | outcome, code, reason |

**Run number 8 last.** It only means anything once the original is already in your ledger.

**Six of these eight should come back as exceptions**, each with a different code — one for each check in §2. Two should pass cleanly. If you get a different split, something is wrong, and finding out what is the exercise.

---

## 10. What to bring to the review

1. **Your results table** — all eight invoices, outcome, code and reason.
2. **A working demo** — one invoice that clears, one that raises an exception.
3. **A sketch of your flow** — the order your checks run in. Whiteboard is fine.
4. **One thing that did not work first time** and what you did about it.

---

## 11. If something goes wrong

| Symptom | Likely cause |
|---|---|
| Connector test fails right after creating it | You tested too soon. Wait two or three minutes |
| `401` with `Missing or invalid x-api-key header` | The API key does not match. Check with your facilitator |
| Flow works in the designer but the agent never calls it | The flow is not published, or the tool name and description are too vague |
| Arithmetic gives odd results | You are using the text version of an amount, not the number version |
| Everything is an exception | Your checks are probably running in the wrong order, or comparing the wrong two fields |
| `INV-2026-0015` comes back as an exception | Your total check has no tolerance. It is out by one cent, which is allowed |
| `INV-2026-0004` comes back clean | You compared against `qtyOrdered` instead of `qtyReceived` |

---

## 12. If you finish early

- Use the **confidence scores** from AI Builder: if any key field is below 0.65, mark the invoice for human review regardless of the checks.
- Make it **idempotent** — run `INV-2026-0001` three times and make sure you get one ledger row, not three.
- Add an **Approvals** step so exceptions actually go to a person.
- Ask your facilitator for the four checks this lab left out and the seven extra invoices that exercise them. That is the L300–L400 lab.

---

## 13. Reference

- `01-Copilot-Studio-Agents-Classic-vs-New.md` in this pack
- [Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Invoice processing prebuilt AI model](https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing)
- [Use the invoice processing prebuilt model in Power Automate](https://learn.microsoft.com/en-us/ai-builder/flow-invoice-processing)
- [Add an agent node to a workflow](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)
- [Add a workflow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent)

Ask questions while you build. Being stuck quietly for three hours is not the exercise.
