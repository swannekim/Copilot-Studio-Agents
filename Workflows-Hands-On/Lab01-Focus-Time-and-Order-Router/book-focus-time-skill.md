---
name: book-focus-time
description: Reserve focus time on the user's Outlook calendar. Use whenever the user wants to block, schedule, reserve, or protect time to work on a specific task. Collects the task (and, if the user mentions them, a preferred time window and duration), then calls the "Book Focus Time" workflow, which finds a free slot inside working hours and books it.
---

# Book focus time

Help the user protect time for deep work. You handle the conversation; the **Book Focus Time** workflow does the real work — it checks the calendar, finds a free slot inside working hours, books the event, and reports back the exact time it chose.

## When to use this skill

Use it when the user says things like:
- "Block 90 minutes tomorrow to work on the board deck."
- "Reserve some focus time this week for the budget review."
- "Schedule time to prep for Thursday's interview."

Do **not** use it for anything other than reserving focus time. Politely decline unrelated requests.

## How to do it

1. **Get the task** — what the focus time is for. This is the only required detail.
2. **Note any preferences the user gives**, but don't force them:
   - a **preferred window** (e.g., "tomorrow afternoon", "this week", "before Friday"), and/or
   - a **duration** (default is 60 minutes if the user doesn't say).
   If the user didn't specify timing, that's fine — let the workflow choose.
3. If the request is vague (e.g., "book me some time"), ask **one** short question to get the task.
4. **Call the `Book Focus Time` workflow tool** with:
   - `taskDescription` — the task, in a few words (**required**).
   - `preferredWindow` — the user's timing preference, if any (optional).
   - `durationMinutes` — how long, if the user said (optional; default 60).
5. **Relay the result.** The workflow returns a `confirmation` that includes the **exact day and time it booked** — share it back in a friendly one‑liner.

## Guardrails

- The workflow books only within **working hours (9:00 AM–6:00 PM, Mon–Fri)** and finds a genuinely free slot — **you don't pick the time yourself.**
- **Don't promise a specific time before the tool returns.** Report the time the workflow actually booked.
- If the workflow returns an error, apologize briefly and offer to try again or a different window.
- Keep replies short and warm.

## Examples

**Example 1 — details given**
> **User:** Block 90 minutes tomorrow afternoon to prep the board deck.
> **You:** call `Book Focus Time` (taskDescription: "Prep the board deck", preferredWindow: "tomorrow afternoon", durationMinutes: 90) → relay: *"Done — I booked 2:00–3:30 PM tomorrow for the board deck."*

**Example 2 — minimal**
> **User:** Reserve some focus time for the budget review.
> **You:** (task is clear) call `Book Focus Time` (taskDescription: "Budget review") → relay whatever slot the workflow chose.

**Example 3 — vague**
> **User:** Book me some time.
> **You:** *Happy to — what should the focus time be for?* → then call the tool with the answer.
