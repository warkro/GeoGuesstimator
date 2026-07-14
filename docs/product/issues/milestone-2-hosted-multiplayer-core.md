# Milestone 2: Hosted Multiplayer Core

## Outcome
Allow a host to create a live game session and multiple players to join and play the same round sequence together.

## Why This Milestone Exists
Shared play is the highest-value product step after solo gameplay is stable. It turns GeoGuesstimator from a prototype into a usable event or team activity.

## In Scope
- Node.js backend service for authoritative room and session orchestration
- Host controls for starting and advancing rounds
- Join flow by code or shareable session link
- Authoritative round locking, reveal timing, score calculation, and real-time room updates
- Active-session leaderboard

## Out Of Scope
- Team aggregation
- Weekly winner tracking
- Long-term player history
- Social profile features

## Status
Ready to start.

## Closed Work Items
- None yet.

## Recommendation
Use the existing local round/session model as the product contract seed, then build Milestone 2 on a Node.js service in ordered layers: contract first, backend session authority second, transport third, host/player UX fourth, and live-session validation last. This keeps the frontend from inventing multiplayer behavior before the server owns it.

## Proposed Scope
In scope for Milestone 2:
- One host creates a room and runs one live session against a predefined curated round pack.
- Players join by room code or equivalent short share flow.
- A Node.js service becomes authoritative for room state, round progression, guess submission windows, reveal timing, scoring, and real-time fan-out to connected clients.
- The client supports two explicit surfaces: host controls and player gameplay/join states.
- The session ends with a live leaderboard for that room only.

Out of scope for Milestone 2:
- Team scoring or team rooms.
- Cross-session history, user profiles, or durable player identity.
- Organizer tooling for creating or approving rounds.
- Rich moderation, uploads, or media storage workflows.
- Advanced variants such as timed streaks or async play.

## Delivery Plan
1. Lock architecture and contracts.
	- Confirm the Node.js service boundary before implementation begins.
	- Define the canonical room, player, round, guess, reveal, and leaderboard state shapes.
	- Reconcile the existing local client session phases with the hosted lifecycle so the multiplayer model does not fork from the shipped solo logic.
	- Exit criteria: one written contract for state transitions, one selected Node.js service approach, and one agreed authority boundary for scoring, round advancement, and real-time updates.

2. Build backend room authority.
	- Add room creation, join, leave, and session-start capabilities.
	- Add server-owned round progression using the current curated local pack as source content.
	- Add authoritative scoring based on submitted coordinates.
	- Exit criteria: the Node.js service can progress a room through a full game without any frontend-only state authority.

3. Add real-time synchronization.
	- Push room state, round transitions, reveals, and leaderboard updates to connected clients.
	- Handle reconnect and duplicate-submission behavior at the room level.
	- Define the waiting, active, revealed, and completed states clients must render.
	- Exit criteria: multiple clients stay in sync across one complete hosted session in local testing.

4. Ship host and player product flows.
	- Add host room creation and round-advance controls.
	- Add player join, waiting-room, active-guess, locked, and reveal states.
	- Reuse the current map and clue surfaces where possible instead of creating a second gameplay model.
	- Exit criteria: a host can start a room, players can join cleanly, and the UI clearly separates host-only and player-only actions.

5. Add live leaderboard and finish-line validation.
	- Show per-room standings during or after reveals, with a final room leaderboard at session end.
	- Validate the full path with at least one host and three players using the same round sequence.
	- Exit criteria: Milestone 2 acceptance criteria pass in a real hosted session rehearsal.

## Issue-Ready Work Items
- [ ] Document the Node.js service and real-time approach for hosted sessions.
- [ ] Define the shared room/session state contract and transition rules.
- [ ] Implement room lifecycle endpoints or functions: create, join, leave, start, advance, complete.
- [ ] Implement server-authoritative guess submission and scoring.
- [ ] Implement client subscription to room state updates and reveal events.
- [ ] Add host room controls and room-status UI.
- [ ] Add player join flow, waiting state, and in-session state handling.
- [ ] Add room-scoped leaderboard and final results view.
- [ ] Run a hosted-session rehearsal and capture any contract or UX defects before Milestone 3.

## Implementation Notes
- No backend, real-time transport, or multiplayer UX exists in the current repo today.
- The current solo baseline already provides reusable clue, map, and local session surfaces in `src/App.tsx`, `src/components/MapBoard.tsx`, `src/game/rounds.ts`, and `src/game/session.ts`.
- Milestone 2 should reuse those gameplay assumptions where possible and move authority into the Node.js service rather than duplicating the game loop in the client.

## Dependencies
- Milestone 1 round-state model
- Agreed Node.js service contract and real-time transport approach
- Explicit host-versus-player UX split

## Risks
- Real-time state drift between clients and server.
- Premature UX complexity if host/player flows are not clearly separated.
- Delay in settling the Node.js service contract can stall all downstream Milestone 2 work because transport, deployment, and authority boundaries depend on it.
- Rebuilding the round loop independently on the server and client would create avoidable behavior drift.

## Success Criteria By Phase
- Planning complete: Node.js service direction and room contract are approved.
- Backend complete: room lifecycle, authoritative scoring, and real-time state updates work against the curated pack.
- Frontend complete: host and players can join, wait, guess, reveal, and finish from distinct but consistent UI states.
- Validation complete: a live rehearsal with at least one host and three players completes without state divergence.

## Acceptance Criteria
- A host and at least 3 players can complete a live session together.
- All players see the same clue and reveal timing.
- Scores are computed authoritatively and consistently.
- The host can control session start and round advancement without requiring code changes or manual state resets.