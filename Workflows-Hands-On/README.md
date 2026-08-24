# Workflows Hands-On Labs — New Copilot Studio

Two independent hands-on labs for the **Workflows** experience in the new Copilot Studio. Each lab
is self-contained in its own folder, with its own README, and neither depends on the other.

| Lab | Focus | Format |
|---|---|---|
| [**Lab01 — Focus-Time and Order Router**](./Lab01-Focus-Time-and-Order-Router/) | Building your first workflows, then calling one from an agent | 2 exercises + 1 module, ≈ 100 min |
| [**Lab02 — Agentic Workflow Scenarios**](./Lab02-Agentic-Workflow-Scenarios/) | Four production patterns: AI classification, human-in-the-loop approval, scheduled briefings | Pick 2 of 4 scenarios, 30 min each |

---

## Lab01 — Focus-Time and Order Router

Start here if you are new to Workflows. It builds two workflows from scratch with full screenshots,
then shows how an agent can call one of them as a tool.

| File | Contents |
|---|---|
| `README.md` | The lab guide — Exercise 1 (Focus-Time Assistant), Exercise 2 (Order-Management Router) |
| `Build-a-Simple-Agent-that-Calls-a-Workflow.md` | Follow-on module: making a workflow agent-callable and wiring it to an agent |
| `book-focus-time-skill.md` | Supporting skill definition for Exercise 1 |
| `img/` | Screenshots referenced by the guides |

## Lab02 — Agentic Workflow Scenarios

Four independent scenarios, each a complete 30-minute build. Participants pick any two for a
one-hour session. Heavier on AI nodes and human review; built for a DLP-restricted tenant using
Microsoft 365 connectors only.

| Scenario | Trigger | Pattern |
|---|---|---|
| IT Request Triage Desk | Email arrives | Classify → log to Excel → acknowledge → escalate |
| Reply Desk with Approval | Email arrives | Copilot drafts → human approves or revises → send |
| Daily Brief 0800 | Schedule | Copilot reads your day → agent formats → post to Teams |
| Friday Project Roll-up | Schedule | Read Excel → agent analyses → approve → distribute → archive |

| File | Contents |
|---|---|
| `README.md` | Lab overview, prerequisites, scenario picker |
| `Copilot-Studio-Workflows-HandsOn-Lab-Pack.md` | The full lab guide — all four scenarios, troubleshooting, facilitator notes |
| `Workflows-Lab.xlsx` | Optional prebuilt workbook for the Excel prerequisite |

---

## Which should I run?

- **New to Workflows** → Lab01. It assumes nothing and shows every screen.
- **Comfortable already, want production patterns** → Lab02, scenarios 1 + 2.
- **Need the governance story** (human approval in front of an AI action) → Lab02, scenarios 2 + 4.
- **One-hour slot, nothing firing unexpectedly** → Lab02, scenarios 3 + 4 (both scheduled).

Both labs need a Copilot Studio environment where **Workflows** appears in the left navigation,
below **Agents**, and a single identity used consistently across Copilot Studio, Outlook, Teams and
OneDrive. Each lab's README lists its own prerequisites in full.
