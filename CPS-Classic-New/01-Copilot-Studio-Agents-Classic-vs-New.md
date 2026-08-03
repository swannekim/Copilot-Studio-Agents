# Copilot Studio: Classic vs New Agents, Agent Flows vs Workflows

**Classification:** Microsoft Internal — contains NDA roadmap and pre-launch billing content. Do not share externally. See §10.

---

## How to use this document

Read §1 before the lab — it is the mental model everything else hangs off. §4 is the comparison table. §9 is the decision guide you will actually use in front of a customer. §11 tells you which claims are solid and which are provisional, so you do not repeat something in a customer meeting that turns out to be preview-only.

Every non-obvious claim links to its source. Where Microsoft has not published something, this document says so rather than guessing.

---

## 1. The single most important idea: two independent axes

Most confusion about "classic vs new Copilot Studio" comes from collapsing two separate things into one. They are independent.

| Axis | Values | Where you set it |
|---|---|---|
| **Experience** — the authoring surface | Classic experience / New experience | Chosen when you create the agent; `Try it now` on the classic home page switches you over |
| **Orchestration mode** — how the agent decides what to do | Classic orchestration / Generative orchestration | **Only settable in the classic experience**, at Settings → Generative AI → Orchestration |

Two consequences interns get wrong constantly:

1. **The new experience has no orchestration toggle.** "All agents use the enhanced orchestration runtime, which provides deeper reasoning and improved response quality," and the new experience "uses the enhanced orchestration runtime for all agents, with no option to switch" ([Classic vs. new agent experience](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/classic-vs-new)).
2. **"Classic experience" does not mean "old-fashioned agent."** An agent authored on the classic canvas with **generative orchestration** turned on gets dynamic tool selection, proactive knowledge search, automatic slot-filling and connected agents. Generative orchestration is the default for newly created agents ([Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)).

**How to tell which experience you are in:** classic shows **Topics, Knowledge, Actions, Settings** in the left navigation; new shows **Build, Preview, Evaluate, Monitor** tabs across the top ([Classic vs. new](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/classic-vs-new)).

### There is no migration path, in either direction

> "You can't transfer agents created in the new experience to the classic experience. You also can't transfer agents created in the classic experience to the new experience. This limitation exists because the two experiences use fundamentally different architectures and orchestration runtimes." ([Classic vs. new](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/classic-vs-new))

Both run side by side in the same environment. Classic is fully supported with no announced deprecation.

---

## 2. Classic agent anatomy

| Component | What it is |
|---|---|
| **Topics** | Authored conversation units with trigger phrases and a node-based canvas — messages, questions, conditions, variables, tool calls. Up to **1,000 topics per agent**, **200 trigger phrases per topic** ([Quotas](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)) |
| **Knowledge** | SharePoint, Dataverse, public websites, uploaded files, Azure AI Search, Copilot connectors. **500 knowledge sources per agent** |
| **Actions / Tools** | Connectors, agent flows, prompts, custom connectors, MCP servers. Max **128 tools per agent** under generative orchestration, with 25–30 recommended ([Add tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)) |
| **Child agents / connected agents** | Delegation to a specialised agent. Selected by description, and **only under generative orchestration** |
| **Instructions** | Up to **8,000 characters** |

### Orchestration behaviour, side by side

Taken verbatim from [Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions):

| Capability | Generative orchestration | Classic orchestration |
|---|---|---|
| Topics | "The agent selects topics based on the description of their purpose." | "The agent selects topics based on matching a user query with trigger phrases." |
| Tools | "The agent can choose to call tools based on their name and description." | "Tools can only be called explicitly from within a topic." |
| Knowledge | "The agent can choose to proactively search knowledge…" | "Knowledge can be used as a fallback when no topics match…" |
| Combining | "The agent can use a combination of topics, tools, and knowledge." | "The agent tries to select a single topic… falling back to knowledge if configured." |
| Asking for input | "The agent can automatically generate questions to prompt users for any missing information…" | "You must use question nodes in topics…" |
| Child/connected agents | "The agent selects child and connected agents based on their description." | "Not applicable." |

### How generative orchestration picks a tool — teach this explicitly

Tool selection is driven by natural-language metadata, so **naming is engineering work, not cosmetics**.

- "The most important factor is the description of the topics, tools, agents, and knowledge sources. Other factors include the name… any input or output parameters, and their names and descriptions."
- "**Names matter more than anything. Avoid cryptic names.**" and "Prefer using tool names. Names carry more weight than descriptions." ([Generative orchestration guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration))
- Write descriptions in "the active voice and the present tense" — "This tool provides weather information", not "Weather information is provided by this tool."
- Keep summaries to one or two sentences, and make them **distinct**: "If multiple topics have similar descriptions, your agent might invoke them all."
- Input names drive automatic questions: "your input names should be human-friendly (for example, 'start date,' 'email address')."

---

## 3. New agent anatomy

Authoring "starts with a natural language description of the agent's purpose and behavior," and "instructions and reasoning drive agent behavior instead of explicit topic flows" ([Classic vs. new](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/classic-vs-new)).

| Tab | Purpose |
|---|---|
| **Build** | Identity, instructions, Knowledge, Tools, Skills, Model, Microsoft IQ, Connected agents, Memory |
| **Preview** | Interactive test chat with an activity trace showing knowledge consulted and tools invoked |
| **Evaluate** | Named test sets of conversations plus a test method |
| **Monitor** | Recent tasks, files accessed, activity. **Unavailable until you publish** |

Source: [Agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview).

### Skills — the replacement for topics and child agents

A skill is a "reusable capability — self-contained sets of instructions and logic," and "the orchestration runtime **invokes a skill when a user's request matches the skill's purpose**" ([Skills overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview)).

- Format: **YAML front matter (`name`, `description`) + Markdown instructions.**
- Single file: a `.md`. Multi-file: a **ZIP containing `SKILL.md`** plus optional scripts, templates and reference documents.
- Name rule: lowercase letters, numbers and hyphens; no leading or trailing hyphen ([Create a skill](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-create)).
- **The `description` is what makes the skill fire.** It is the routing signal, exactly like a tool description.
- Limit: **100 skills per agent** ([Quotas](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)).

### Memory

Stored **per user, per agent**; enabled by a maker toggle on the Build tab; **memories expire after 28 days of user inactivity**; turning memory off does **not** delete what is already stored; users get a memory portal to view and delete ([Memory](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview)).

### Connected agents

The primary agent's orchestrator routes to a connected agent, which "runs in its own orchestration context (own instructions, knowledge, tools)." Today "you can **currently only connect other agents built in Copilot Studio**" ([Connected agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-other-agents)).

---

## 4. Agent Flows vs Workflows — the comparison table

This is the headline comparison. Agent flows are the classic automation experience; Workflows are the new one.

> Both are described in identical language as **deterministic**: "They execute actions or tasks following a rule-based path. The same input always produces the same output." ([Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview) · [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview))

| Dimension | **Agent flows** (classic experience) | **Workflows** (new experience) |
|---|---|---|
| Product status | Generally available | **Public preview** |
| Where you create it | Classic experience → Workflows page → **New agent flow** | New experience → Workflows → **New workflow** |
| Authoring canvas | Agent flow designer | Redesigned drag-and-drop visual canvas with "native AI actions, agent handoffs, and node-level testing" |
| Execution model | Deterministic, rule-based | Deterministic, rule-based |
| Trigger families | Instant (on demand), schedule, event | Instant, schedule, event — surfaced as Manual/HTTP request, Recurrence/sliding-window/polling, Connector event, HTTP webhook |
| Agent-callable trigger | `When an agent calls the flow` | `When an agent calls the flow` |
| Action categories | AI capabilities, Human in the loop, Built-in tools, Connectors | Same four categories |
| AI actions available | Generate text, process documents, run a prompt on a model, call an agent, reply to a calling agent | Same list |
| **Embedding an agent as a step** | Via the "call an agent" AI action | **First-class Agent node** — call an existing published agent, **or build an inline agent inside the node** with its own instructions, model, tools, knowledge and output schema |
| Inline (throwaway) agent | Not available | **Yes.** Scoped to the workflow, travels with it, **cannot be reused elsewhere** |
| Output shaping | Flow outputs | **Text response / Structured output / Custom structured output** against a JSON schema you define; each field becomes its own dynamic-content token |
| Per-node testing | Flow checker (design-time validation only) | **Test this node** in isolation, with inputs typed manually or loaded from one of the **10 most recent runs**; plus end-to-end Run flow test |
| Node-level evaluations | Not available | **Yes** — natural-language test methods returning Pass/Fail with evidence. Limits: inline agents only, no custom model, **≤5 auto-generated methods**, **≤20 evaluations per node per day** |
| Microsoft 365 Copilot node | Not available | **Yes** — hands a step to M365 Copilot grounded in the running user's mail, files, calendar and chats; can target Researcher or Analyst |
| Human in the loop | Approvals connector; **Request for information** (Outlook only, first responder wins, no external users); **Multistage and AI approvals** (preview) | "Human in the loop" actions including requesting information; agent node offers **Request human assistance when unsure**, which emails the connection owner and waits |
| Child flows | Supported | Supported ("child workflows") |
| Desktop / RPA flows | **Cannot be called** from agent flows | Not documented |
| Converting a Power Automate cloud flow | **Yes**, by changing the flow's plan to Copilot Studio. **One-way and irreversible** | **No.** "You can't convert a Power Automate flow to the new workflow format." |
| Billing | Copilot Studio capacity. **13 Copilot Credits per 100 agent flow actions** | Consumes Copilot Studio capacity per action executed |
| Solutions / ALM | In solutions, with drafts, versioning, export, import | Not separately documented — see §11 |
| Copy, share, co-own | **Not supported** for agent flows | Not documented |
| Sync limit when called by an agent | **100 seconds** | **100 seconds** |

**Sources:** [Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview) · [Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview) · [Agent node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow) · [Microsoft 365 Copilot node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/microsoft-365-copilot-node-workflow) · [Workflow designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-designer) · [Add a workflow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent) · [Agent flows FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs) · [Request for information](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information)

---

## 5. What moved: topics, child agents, prompts

| Classic construct | Where it went in the new experience | Status |
|---|---|---|
| **Topics** | A combination of **Skills** and **Workflows**. Skills cover most conversational intents; Workflows cover deterministic logic | Replaced by design |
| Topic-based interception (session start, pre/post tool) | **Hooks** | **Roadmap, Q3 CY26. Not shipped.** Use Workflows today |
| **Child agents** | **Skills** for "instructions for a use case"; **connected agents** where genuinely separate context, tools or knowledge is needed | Superseded |
| **Prompts** | An **agent node inside a workflow** when you need a specific model or structured JSON; otherwise agent instructions or a skill | Replaced by design |
| **REST API tool** | Custom connectors | Available |

Classic topics remain available and fully supported on the classic experience.

---

## 6. Wiring agents and automation together

There are two directions, and interns should be able to draw both.

### 6a. Workflow calls an agent — the Agent node

Add an **Agent node**, choose an existing published agent or build an inline one, pass a message with dynamic content from earlier steps, pick the output shape, then consume the result downstream. "The workflow waits for the agent to complete its task" ([Agent node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)).

Use it when a step needs judgement. Keep the deterministic work in ordinary nodes on either side.

### 6b. Agent calls a workflow — workflow as a tool

Four requirements, all mandatory ([Add a workflow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent), [Modify a flow for use with an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-modify-use-with-agent)):

1. Uses the `When an agent calls the flow` trigger **and** a `Respond to the agent` action.
2. Responds in **real time** — asynchronous response **off**. An async response produces `Error code: 3000` at runtime.
3. Is **published**.
4. Responds within the **100-second** action limit.

### 6c. The 100-second rule and the pattern that beats it

This is the single most important architectural constraint in the lab, and it is where most designs fail.

**An approval cannot happen inside a synchronous tool call.** A human will not respond in 100 seconds. Attempting it produces a timeout, not a pending approval.

The documented pattern:

> "Actions in the flow that need to run longer can be placed **after the Respond to the agent action** to continue to run up to the flow run duration limit of **30 days**." ([Modify a flow for use with an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-modify-use-with-agent))

So the correct shape is:

```
When an agent calls the flow
  → deterministic validation + ERP lookups + matching      (fast, well under 100 s)
  → Respond to the agent   ← returns the match verdict immediately
  → Start and wait for an approval                          (minutes, hours, days)
  → post to ERP / send rejection / update the ledger
```

Everything the agent needs to *say* happens before the response. Everything that waits on a human happens after it.

---

## 7. Limits and quotas that bite in a lab

| Limit | Value |
|---|---|
| Agent flow / workflow sync response to an agent | **100 seconds** |
| Flow run duration after responding | up to **30 days** |
| Instructions | 8,000 characters |
| Topics per agent | 1,000 (Dataverse environments) |
| Trigger phrases per topic | 200 |
| Tools per agent, generative orchestration | 128 max, **25–30 recommended** |
| Skills per agent | 100 |
| Knowledge sources per agent | 500 across all types |
| Connector payload | 5 MB (GCC 450 KB) |
| File upload | 512 MB per file, 500 files |
| Dataverse knowledge | 2 sources per agent, 15 tables per source |
| SharePoint sites as knowledge, generative | 25 URLs |
| Workflow node evaluations | ≤5 auto-generated test methods, ≤20 evaluations per node per day |

Source: [Quotas and limits](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas) unless noted.

> ⚠ **Documented contradiction:** the express-mode page states flows must complete in **two minutes**, which conflicts with the 100-second limit stated elsewhere. Treat 100 seconds as the design budget.

---

## 8. Billing, in one table

Since 1 September 2025 the currency is **Copilot Credits**, not messages ([Billing and licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)). Legacy "message" wording still appears in places.

| Agent feature | Copilot Credits | M365 Copilot licensed user |
|---|---|---|
| Classic answer | 1 | No charge |
| Generative answer | 2 | No charge |
| Agent action | 5 | No charge |
| Tenant graph grounding, per message | 10 | No charge |
| **Agent flow actions, per 100 actions** | **13** | No charge |
| Content processing tools, per page | 8 | No charge |

Source: [Copilot Credits management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management).

Three things worth knowing for customer conversations:

- **Zero-rating for agent flows is narrow.** "For agent flows, the 'No charge' inclusion applies only to runs triggered via the 'When an agent calls the flow' trigger… Agent flows using other triggers consume Copilot Credits at the standard rate."
- **Testing is free.** Running a flow from the designer or the agent's test chat does not consume capacity.
- **Enforcement blocks flows, not the agent.** When prepaid capacity is exhausted, new agent flow runs are blocked while "the parent agent continues to function normally for all non-flow interactions."

---

## 9. Decision guide

### Classic experience or new experience?

**Use the new experience when:** you are building a new agent; the value is in reasoning over Microsoft 365 or document-heavy content; you want instruction-driven behaviour and built-in evaluation; you can live with the current channel list.

**Use the classic experience when:** you need **precise, deterministic control over a conversation** with explicit branching; you need a channel the new experience does not yet publish to; you need a mature feature that has not landed yet; you are extending an agent that already exists there.

### Agent flow or workflow?

If the agent is classic, you use agent flows. If the agent is new, you use Workflows. The interesting question is the one underneath:

### Deterministic step, or agent step?

This is the judgement that separates an L200 build from an L400 one.

| Put it in a deterministic node when… | Put it in an agent / LLM step when… |
|---|---|
| The rule is written down and auditable | The input is unstructured — a PDF, an email body, free text |
| The output must be identical every run | The task needs judgement, classification or summarisation |
| It is arithmetic, a threshold, or a comparison | You need natural language out |
| Getting it wrong costs money or breaks compliance | Being approximately right is genuinely acceptable |

**Money maths never belongs in a prompt.** An LLM asked to compare `149.50` against `148.00` and apply a 2% band plus a $50 absolute cap will be right most of the time — and "most of the time" is not a control an auditor accepts.

---

## 10. Microsoft Internal — August 2026 launch and roadmap

> 🔒 **Microsoft Internal / NDA. Do not share with customers without an NDA in place. Do not leave these pages behind.**
> Source: *Copilot Studio FAQ – August 2026 Launch (Internal)* and *Microsoft Copilot Studio Futures — NDA Roadmap*. Dates are calendar year and are subject to change.

### The three harnesses

| Harness | What it is | Example | Billing |
|---|---|---|---|
| **Copilot Chat harness** | Customise M365 Copilot with organisational knowledge | Onboarding agent answering from SharePoint | Zero-rated with a Copilot USL |
| **Standard harness** | Rule-based conversational agents, topics, **agent flows** | IT onboarding agent routing laptop requests through approval | Zero-rated with a Copilot USL |
| **GitHub Copilot harness** | Agentic build experience for end-to-end business processes | AP agent reading invoices, matching POs, routing exceptions | **Usage-based Copilot Credits — charged for both creation and runtime** |

"Harness" and "orchestrator" are not synonyms: Copilot Studio has a broader orchestrator that wraps the harness with standard features, and model choice stays at the Copilot Studio level and is passed through.

### Billing enforcement dates

- Agents and workflows created **on or after 3 August 2026** consume Copilot Credits under the GitHub Copilot harness usage model **immediately**.
- Agents and workflows created **before 3 August 2026** enter a grace period and begin consuming credits on **1 September 2026**, with in-product notifications.
- **No take-back:** existing zero-rated Standard harness scenarios keep their economics. Nothing is auto-migrated.
- **Maker activities are billed on the GitHub Copilot harness** — natural-language authoring, Preview, and Evaluate all consume credits. Manual configuration in Build and Monitor does not. On Standard and Copilot Chat harnesses there are **no** billing changes to Evals, Preview or Testing.

### Quality claims (internal benchmark, same scenario, all on Sonnet 4.6)

Knowledge +20.4 pts (66.0% → 86.4%); Code analysis +47.5 pts (40.6% → 88.1%); File analysis +28.2 pts (63.5% → 91.7%); Multi-tool +11.9 pts (87.0% → 98.9%); input tokens −45%. Against a leading competitor on a retail dataset, +29 pts evaluation pass rate as of May 2026. Note the internal caveat: evals are deliberately designed to push agents to failure, so ~65% is considered strong and eval pass rates are not production success rates.

### Roadmap items relevant to this lab

| Item | Status |
|---|---|
| Hooks — deterministic logic at lifecycle points | **Preview 08/2026 → Q3 CY26.** Use Workflows today |
| Native event triggers inside agents | Q3 CY26. Today: Workflows plus an agent node |
| Multi-agent to Foundry, M365 Agents SDK, A2A | Q3 CY26. Today: Copilot Studio agents in the same environment only |
| Full channel catalogue in the new experience | Q3 CY26 |
| Computer Use in the new experience | Q3 CY26 |
| Migration path classic → new | Q3 CY26, as guided natural-language recreation rather than a converter |
| Skill and plugin marketplace | Preview 09/2026 |
| Tool-use approvals (HITL guardrails) | Preview 08/2026 |
| Persistent agent accounts, coachable agents | Preview 09/2026 |
| Apps in Copilot Studio | Public preview 18/08/2026 |

### Agents built on different harnesses cannot be connected to each other

Both can run in the same environment side by side, but a new-experience agent and a classic agent cannot be wired together as connected agents. This constrains any "strangler fig" migration story — plan for parallel builds, not incremental replacement.

---

## 11. Confidence and status — read before quoting any of this

Being precise about what is confirmed protects you in front of a customer.

### Solid — public Microsoft Learn documentation

Agent anatomy for both experiences; orchestration mode behaviour; the agent flow and workflow feature sets; the agent node; skills format and limits; memory scope and 28-day expiry; connected-agent restrictions; the 100-second limit and the after-response pattern; quotas; Copilot Credit rates; no migration path.

### Provisional — internal FAQ only, not yet on public docs

- **The 3 August 2026 GA date and the "GitHub Copilot harness" branding.** As of 2 August 2026 every public Learn page for the new experience is still labelled prerelease: the **agent** experience as *production-ready preview*, the **workflows** experience as *public preview*. Microsoft's own changelog records the experience launching **9 June 2026**. Expect the public labels to flip, but do not assert GA to a customer on the strength of an internal FAQ alone.
- Usage-based billing specifics for the new harness, including the 1 September grace period.
- **Hooks.** No Learn page exists. Do not present hooks as available.
- Cross-harness and same-environment connected-agent scoping.

### Not found in documentation

- A dedicated **document extraction node** in Workflows. Use the AI **process documents** action or an agent node reading an attachment.
- A formal try/catch or "configure run after" scope specifically for agent flows.
- New-experience-specific export, import and pipeline ALM guidance beyond choosing a solution at creation.
- An enumerated list of every scheduled and event trigger available inside the agent flow designer.

---

## Sources

Primary documentation, all Microsoft Learn:

- [Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)
- [Workflows overview (new experience)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview)
- [Classic vs. new agent experience](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/classic-vs-new)
- [Agents overview (new experience)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview)
- [Add an agent node to a workflow](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/agent-node-workflow)
- [Microsoft 365 Copilot node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/microsoft-365-copilot-node-workflow)
- [Workflow designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-designer)
- [Add a workflow as a tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent)
- [Modify a flow for use with an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-modify-use-with-agent)
- [Generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions)
- [Generative orchestration guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration)
- [Add tools to a custom agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent)
- [Skills overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview) · [Create a skill](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-create) · [Add an existing skill](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-add-existing)
- [Memory](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview)
- [Connected agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-other-agents)
- [Available channels (new experience)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview)
- [Agent flows FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs)
- [Request for information in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information)
- [Multistage and AI approvals (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals)
- [Quotas and limits](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)
- [Copilot Credits management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management) · [Billing and licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)

Internal, NDA: *Copilot Studio FAQ – August 2026 Launch (Internal)*; *Microsoft Copilot Studio Futures — NDA Roadmap*, deck owner Lucia Mosner.
