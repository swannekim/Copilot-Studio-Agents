# Agentic Workflows Lab — Building Workflows in the New Copilot Studio

A self-contained, L200–250 hands-on lab pack for the **Workflows** experience in the new Copilot Studio.

Four independent scenarios, each a complete 30-minute build. Participants pick **any two** for a
one-hour session — there are no dependencies between them.

> This lab is **independent** of the other lab in the parent `Workflows-Hands-On` folder
> (Focus-Time Assistant / Order-Management Router). Either can be run without the other.

---

## The four scenarios

| # | Scenario | What it does | Trigger |
|---|---|---|---|
| 1 | **IT Request Triage Desk** | Classifies and prioritises every request email, logs it to an Excel tracker, acknowledges the sender, and escalates urgent items to Teams. | Email arrives |
| 2 | **Reply Desk with Approval** | Microsoft 365 Copilot drafts a grounded reply, a human approves or requests changes, an agent applies the feedback, and the workflow sends it. | Email arrives |
| 3 | **Daily Brief 8AM** | Each weekday morning, Copilot reads your calendar, mail and chats; an agent formats a fixed brief and posts it to Teams. | Schedule |
| 4 | **Friday Project Roll-up** | Reads a project tracker in Excel, an agent analyses status and risk, the team lead approves, then it emails leadership, posts to Teams and archives the report. | Schedule |

### Node coverage

| | Agent | M365 Copilot | Human review | Excel | Outlook | Teams |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **1 · IT Request Triage Desk** | ✅ | ➕ | ➕ | ✅ | ✅ | ✅ |
| **2 · Reply Desk with Approval** | ✅ | ✅ | ✅ | ➕ | ✅ | ✅ |
| **3 · Daily Brief 8AM** | ✅ | ✅ | ➕ | ➕ | ➕ | ✅ |
| **4 · Friday Project Roll-up** | ✅ | ➕ | ✅ | ✅ | ✅ | ✅ |

✅ **In the core build** — you will use this node
➕ **Optional extension** — not in the core build, but the guide walks you through adding it if you
finish early.

Use this to pick a pair that covers the nodes you care about. **Scenario 2** is the only one that
uses all three AI node types — Agent, M365 Copilot and Human review — in a single core path, and
**2 + 4** is the only pairing that exercises Human review twice. If you want to see data written to
**Excel**, include **1** or **4**.

### Suggested pairings

| Pairing | Why |
|---|---|
| **1 + 2** ⭐ | Strongest one-hour story. Both fire from an email you send yourself, so you control exactly when each run happens — no waiting on a clock. Use distinct subject prefixes (`[REQ]` and `[Ask]`) so one workflow doesn't swallow the other's test mail. |
| **2 + 4** | The governance pairing — a human gate in front of an AI-drafted action, seen from two angles (free-text feedback vs. structured approve/hold). |
| **1 + 3** | Event-driven vs. schedule-driven automation, side by side. |
| **3 + 4** | Both scheduled, so nothing fires unexpectedly mid-session. |

---

## Files in this folder

| File | Purpose |
|---|---|
| `Copilot-Studio-Workflows-HandsOn-Lab-Pack.md` | **The lab guide.** Everything is here — setup, all four scenarios, troubleshooting, facilitator notes and appendices. |
| `Copilot-Studio-Workflows-HandsOn-Lab-Pack.ko.md` | **Korean translation of the lab guide.** Structurally identical to the English original. Node names, UI labels, token names and all copy-paste values are kept in English, since that is what appears on screen. |
| `img/` | Screenshots referenced by both guides. Keep this folder alongside the guide when moving it. |
| `Workflows-Lab.xlsx` | **Optional shortcut** for the workbook prerequisite. |

### About `Workflows-Lab.xlsx`

Scenarios 1 and 4 read and write an Excel workbook. Section 1.4 of the guide walks participants
through building it by hand, which is worth doing once — the most common failure in Excel-based labs
is a worksheet that *looks* right but was never converted into a real Excel **Table**, so it never
appears in the connector's **Table** dropdown.

This file is that workbook, already built correctly:

| Table | Columns | Contents |
|---|---|---|
| `RequestLog` | 9 | empty — Scenario 1 writes rows here |
| `ProjectTracker` | 6 | 6 sample project rows — Scenario 4 reads these |
| `ReportArchive` | 4 | empty — Scenario 4 writes rows here |

**To use it:** upload it to the root of your **OneDrive for Business**, keeping the filename exactly
`Workflows-Lab.xlsx`, and skip section 1.4. Every table and column name already matches what the
guide expects.

Hand-building it teaches the Table concept; uploading it saves about ten minutes. Either is fine.

---

## Prerequisites

- A Copilot Studio environment where **Workflows** appears in the left navigation, below **Agents**
- One identity used consistently for Copilot Studio, Outlook, Teams and OneDrive — mixing accounts is
  the most common setup failure
- A workbook named `Workflows-Lab.xlsx` in that account's OneDrive for Business (see above)
- Roughly 15 minutes of shared setup, done **before** the session starts, ideally the day before

Full detail is in section 1 of the guide.

## Connector scope

Built for a **DLP-restricted tenant** using Microsoft 365 connectors only — Office 365 Outlook,
Microsoft Teams, Excel Online (Business) and Dataverse. SharePoint, Microsoft To Do, Planner,
Dynamics 365 and third-party connectors are deliberately unused. Where a connector might be blocked,
it is always an optional extension, never a core step, so every scenario completes regardless.

---

## Provenance

Every scenario in this pack was built and run end to end in a live Copilot Studio environment. Field
names, button labels, token names and node names are the ones that appear on screen, and the
troubleshooting section documents failures that were actually hit and fixed during that build —
including several that report **Succeeded** while silently doing nothing.

Both scheduled triggers were additionally verified against real occurrences rather than manual test
runs, which is the only way to prove a recurrence's day, hour and time zone are correct.
