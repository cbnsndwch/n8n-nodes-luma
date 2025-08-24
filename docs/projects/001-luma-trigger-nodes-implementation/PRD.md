# Project 001: Luma Trigger Nodes Implementation

## Overview

Create a suite of custom trigger nodes for n8n that connect to every list-style and relevant resource endpoint in the Luma API, supporting polling-based near‑realtime workflows. Modeled on n8n's established patterns (e.g., Gmail Trigger), leveraging n8n's custom node architecture.

**GitHub Issue**: [#7 - Implement Luma nodes functionality (actions + polling-based trigger)](https://github.com/cbnsndwch/n8n-nodes-luma/issues/7)

## Background & Purpose

- n8n supports custom node creation via the "Creating nodes" framework, allowing both Action and Trigger node types. Trigger nodes must implement an async trigger() method, handle configuration parameters, emit items, and optionally manage cursors via this.getWorkflowStaticData() etc.
- The Gmail Trigger is an official example of a polling trigger—maintains cursor, batches messages, scheduled via cron, supports filters, and adheres to n8n's trigger interface.
- The Luma API exposes several GET "list" endpoints, each rate-limited at 500 GETs per 5 minutes per calendar. Polling strategies (cursor + pagination) are appropriate and safe when done smartly.

This integration unlocks advanced workflows based on Luma entities (events, people, guests, coupons, tags), enabling near‑real-time triggers in n8n for everything Luma manages.

## Scope & Resource Coverage

Trigger nodes must cover:
1. List Events – /v1/calendar/list-events
2. List People – /v1/calendar/list-people
3. List Person Tags – /v1/calendar/list-person-tags
4. List Calendar Coupons – /v1/calendar/list-coupons
5. Get Event Guests – /v1/event/get-guests
6. List Event Coupons – /v1/event/list-coupons
7. (Optionally) Any other Luma GET list endpoints discovered later

All nodes should be Trigger-type, polling periodically, emitting new items only.

## Objectives

- High-quality trigger nodes consistent with n8n core's UI/UX and code standards
- Polling-based near‑real‑time behavior, using cursors and pagination
- Respects Luma rate limits, with exponential/backoff handling on 429s
- User-configurable intervals: presets (e.g., every 15s, 60s, 5m) plus custom cron
- Supports filters: e.g., date ranges, event types, etc.
- Persistent state: uses getWorkflowStaticData('global') to store cursors and seen‑IDs
- Batching and ordering: emits items in chronological order

## Technical Requirements

### 4.1 Node Architecture (common for all triggers)

**Node description (node.ts/node.node.ts):**
- displayName: e.g., "Luma – New Events"
- group: ['trigger']
- version: start at 1
- properties: include
  - Calendar ID or other identifying parameter
  - Poll mode: frequency selector (Every X seconds/minutes or cron)
  - (Optional) Filters (date ranges etc.)

**Trigger method:**
- async trigger(this: ITriggerFunctions): Promise<ITriggerResponse>
- On first run: bootstrap lastTs or lastSeenId to epoch or initial get
- On each execution:
  - Call Luma endpoint via HTTP Request (within code or using HTTP node via $httpRequest)
  - Use filters (updated_at > lastTs) if supported; else fetch and dedupe
  - Paginate until no new items
  - Collect items, sort ascending
  - Update static state (lastTs, seenIds, pagination cursor)
  - Emit items
  - Return closeFunction & manualTrigger hooks if needed
- State persistence via getWorkflowStaticData('global')
- Rate-limit/backoff: on HTTP 429, delay next run by 60s
- Concurrency guard: node should prevent overlapping runs (use maxExecutions: 1 or similar)

### 4.2 Polling Strategy Design

**Cursor:**
- Prefer updated_at timestamp (ISO‑8601 UTC)
- Fallback: id for resources lacking timestamp ordering

**Pagination:**
- Loop with page tokens or page numbers until hitting items older than cursor or no next page

**Dedupe:**
- Use a small in-memory seenIds LRU list in static data

**Cadence Presets:**
- High‑churn endpoints (Events, Guests): 15–30s
- Medium (People): 60–120s
- Low (Tags, Coupons): 5–10 min

### 4.3 Rate Limit Awareness

- Track total GET requests per calendar; optionally store counters in static data
- On 429 error: implement a 60s retry delay and perhaps backoff logic
- Provide warning/logging in node output if approaching limit

## Implementation Plan (Phases)

### Phase 1: Foundation & Core Patterns
- Scaffold a custom trigger node using n8n documentation ("Creating nodes")
- Create generic polling trigger base template:
  - UI fields, trigger method skeleton, HTTP request + static state management
- Model after GmailTrigger structure and behavior: scheduled polling, cursor, batching

### Phase 2: Resource-Specific Nodes

For each resource (Events, People, Tags, Calendar Coupons, Event Guests, Event Coupons):
1. Define node metadata and parameters
2. Implement polling trigger logic:
   - API URL construction
   - Cursor and filter logic
   - Pagination and dedupe
   - Output formatting
3. Test interactions manually with Luma API sandbox/demo

### Phase 3: Rate-Limit & Robustness
- Catch HTTP 429, back off appropriately
- Provide logs or UI feedback when rate limit approached
- Ensure single-run concurrency

### Phase 4: Optimization & UI Enhancements
- Add optional filters (e.g., event type, tags)
- Allow custom cron expressions for advanced scheduling
- Provide examples/docs

### Phase 5: Documentation & Release
- Document each node in README: explanation, usage, examples
- Package as community integration or propose to n8n core
- Add tests (unit / integration via n8n's test harness)

## Epic Structure (GitHub Issues/Tasks)

| Issue | Description |
|-------|-------------|
| EPIC: Luma Trigger Node Suite | High-level integration work |
| Task 1 | Scaffold base custom trigger node (create-node template) |
| Task 2 | Implement Luma Events trigger node |
| Task 3 | Implement Luma People trigger node |
| Task 4 | Implement Luma Person Tags trigger node |
| Task 5 | Implement Calendar Coupons trigger node |
| Task 6 | Implement Event Guests trigger node |
| Task 7 | Implement Event Coupons trigger node |
| Task 8 | Add rate-limit handling and backoff logic |
| Task 9 | Add UI enhancements (filters, cron, presets) |
| Task 10 | Write documentation/tutorial & examples |
| Task 11 | Testing & finalize release packaging |

## Example "New Events" Trigger Node (Skeleton)

```typescript
export class LumaEventsTrigger implements ITriggerNodeType {
  description: INodeTypeDescription = {
    displayName: 'Luma – New Events',
    name: 'lumaEventsTrigger',
    group: ['trigger'],
    version: 1,
    description: 'Listens for new or updated events from Luma',
    defaults: { name: 'Luma New Events' },
    inputs: [],
    outputs: ['main'],
    properties: [
      { displayName: 'Calendar ID', name: 'calendarId', type: 'string', default: '', required: true },
      { displayName: 'Poll Interval (seconds)', name: 'pollInterval', type: 'number', default: 30 },
      // additional filters...
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const state = this.getWorkflowStaticData('global');
    if (!state.lastTs) state.lastTs = new Date(0).toISOString();

    // polling logic: call GET /v1/calendar/list-events
    const params = { calendarId: this.getNodeParameter('calendarId'), updated_after: state.lastTs };
    const allNewEvents = [];
    let page = 1;
    while (true) {
      const res = await this.helpers.httpRequest({ endpoint: '/v1/calendar/list-events', qs: { ...params, page } });
      const events = res.events || [];
      if (!events.length) break;

      for (const e of events) {
        if (new Date(e.updated_at) > new Date(state.lastTs)) {
          allNewEvents.push(e);
          state.lastTs = e.updated_at;
        }
      }
      if (!res.next_page) break;
      page++;
    }

    const items = allNewEvents
      .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
      .map(e => ({ json: e }));

    return {
      closeFunction: undefined,
      manualTriggerFunction: undefined,
      executionData: this.helpers.returnJsonArray(items),
    };
  }
}
```

*(This skeleton is illustrative; full code would refine pagination, error/backoff, concurrency, etc.)*

## Success Criteria & Metrics

- Trigger nodes successfully emit Luma resources on creation or update within seconds
- Remain within Luma's rate limits even at scale
- Users can configure polling timing, identify calendars or events, and apply optional filters
- Robust error handling (429s, network errors)
- Good developer experience: clear docs, consistent UI, maintainable code matching n8n conventions

## Status

**Completed** ✅ 

This project has been completed and the LumaTrigger node has been implemented in the repository at `nodes/LumaTrigger/LumaTrigger.node.ts`.
