# GeoGuesstimator Roadmap

## Recommendation
Treat Milestone 1 as complete for the current solo MVP slice and move immediately into a hosted synchronous multiplayer build in Milestone 2, keeping later content operations and competitive extensions behind a stable shared-session core.

## Why Now
The current repo now delivers the intended solo MVP loop: a real interactive map, a five-round local session, cumulative scoring, and an end-of-session debrief. The next highest-value step is no longer more solo polish; it is turning the proven local round model into a host-controlled multiplayer session before adding persistence-heavy or competitive extensions.

## Current Baseline
- The repo has a React + TypeScript + Vite frontend with a working five-round solo game loop in `src/App.tsx`.
- The current client uses local curated round data in `src/game/rounds.ts`, local scoring logic in `src/game/scoring.ts`, and a reusable local session model in `src/game/session.ts`.
- Leaflet-based map interaction is live in `src/components/MapBoard.tsx`.
- There is still no backend, persistence layer, upload flow, auth layer, or multiplayer transport.
- The root README should describe the repo structure and point product planning work to `docs/product/`.

## Implementation Status Snapshot
- Milestone 1 is complete in the repo for the planned solo MVP path.
- Completed in code: Leaflet map integration, five-round local session flow, cumulative scoring, submit/reveal/continue progression, end-of-session summary, and the map-guidance clarity pass.
- Remaining product work is now concentrated in Milestone 2 and later; no meaningful Milestone 1 blocker remains in the current planning scope.
- Milestones 2 through 4 remain unimplemented in code and continue to rely on new backend and persistence work.

## Product Goal
Ship a version of GeoGuesstimatocregr that lets a host run a short game with shared rounds, image clues, map-based guesses, score reveal, cumulative scoring, and a simple leaderboard. Treat that as the release bar for MVP. Everything else should be sequenced behind it.

## Roadmap Principles
- Prioritize the complete game loop over feature breadth.
- Keep multiplayer hosted and synchronous before exploring asynchronous or highly competitive variants.
- Make content approval and round management operational before opening broader uploads.
- Add persistence before advanced scoring surfaces so results can be trusted and reused.
- Treat accessibility, moderation, and privacy as release requirements, not polish-only work.

## Milestone 1: Playable Solo MVP
**Outcome**
A polished solo experience with real map interaction and multiple rounds.

**Status**
Complete. The repo now contains a real interactive map, a curated five-round local pack, cumulative scoring, round progression, and a final session summary.

**Why this milestone comes first**
This milestone established the round loop, map interaction, and client-side session model that Milestone 2 can now reuse as the authoritative product baseline.

**In scope**
- Replace the temporary map board with Leaflet.
- Support multiple rounds in a single game session.
- Add a round progression model: start, guess, submit, reveal, continue, final score.
- Create a local round set with more than one approved clue.
- Improve responsive behavior and accessibility for the map and round controls.
- Update README and developer setup docs to reflect the real project.

**Out of scope**
- Multiplayer synchronization.
- User accounts.
- Organizer uploads.
- Persistent leaderboards.

**Success criteria**
- A user can play through 5 rounds end to end without code changes.
- Score totals accumulate correctly across rounds.
- The map experience works on desktop and mobile.

**Completion notes**
- The client now ships a five-round local pack and final summary flow.
- Leaflet-based click-to-guess interaction has replaced the placeholder board.
- A focused UI and guidance pass did not surface any remaining Milestone 1 UX gap that warrants holding Milestone 2.

## Milestone 2: Hosted Multiplayer Core
**Outcome**
A host can create a live game and multiple players can join the same round sequence.

**Status**
Ready to start. No backend session orchestration, real-time transport, or multiplayer join flow exists in the current repo, but Milestone 1 no longer blocks this work.

**Why now**
The spec’s main product value comes from shared play. The current client has already proven the round loop and interaction model, so the next constraint is authoritative session orchestration rather than more frontend-only iteration.

**In scope**
- Add a Node.js backend service for authoritative room/session control and round orchestration.
- Implement host controls for starting games and advancing rounds.
- Add join-by-code or shareable session entry.
- Synchronize round state, guess submission, reveal timing, cumulative scoring, and real-time client updates.
- Add a minimal post-game leaderboard for the active session.

**Out of scope**
- Team aggregation.
- Weekly winner tracking.
- Long-term user history.
- Social or profile features.

**Success criteria**
- A host and at least 3 players can complete a live game on the same session.
- The same round image and reveal state are shown consistently to all connected players.
- Round results remain authoritative on the server.

**Execution note**
- Milestone 2 should begin by locking the session contract around a Node.js service that owns room state, session progression, scoring, and real-time updates before host/player UI work expands.

## Milestone 3: Content Operations And Persistence
**Outcome**
Organizers can manage playable content, and results become durable and queryable.

**Status**
Not started. The repo still has no persistence layer, content-management workflow, or historical results surface.

**Why this milestone matters**
Without managed content and persistence, the product cannot scale past demo use. This milestone turns GeoGuesstimator from a prototype into an operational game system.

**In scope**
- Add persistent storage for games, rounds, guesses, and scores.
- Add organizer/admin workflows for round creation and image metadata.
- Add secure image storage.
- Add moderation states such as draft, approved, and rejected.
- Persist match history and expose basic leaderboard views.
- Add optional nickname or lightweight auth support if needed for reliable history.

**Out of scope**
- Full account profiles.
- Complex moderation automation.
- External award/email integrations.

**Success criteria**
- Organizers can publish approved rounds without editing code.
- Completed games and scores can be retrieved after the session ends.
- Unapproved content cannot enter live gameplay.

## Milestone 4: Team Play And Competitive Extensions
**Outcome**
The product expands beyond core hosted play into richer game modes and recurring engagement.

**Status**
Not started. Team play and competitive extensions remain fully deferred until hosted sessions and persistence are stable.

**Why this milestone is later**
These features add value, but they depend on stable session orchestration, content operations, and durable results. Building them earlier would increase rework risk and slow the MVP.

**In scope**
- Team scoring and team leaderboard aggregation.
- Time attack and streak-style variants.
- Weekly winner views.
- Hint difficulty controls.
- Post-game summaries and presentation-friendly winner output.

**Deferred beyond this milestone**
- Outlook or MS Forms poll integrations.
- Award workflow automation.
- Deep profile, badge, or social systems.

**Success criteria**
- Teams can play and be ranked correctly from the same finalized round results as individuals.
- At least one competitive variant reuses the existing round and scoring infrastructure cleanly.

## Ranked Delivery Plan
1. Lock the Milestone 2 Node.js service contract for shared sessions, host authority, and real-time updates.
2. Stand up backend game-session orchestration and real-time multiplayer synchronization in Node.js.
3. Add host controls, join flow, and active-session leaderboard on top of the shared contract.
4. Validate a live hosted session with at least one host and three players.
5. Add persistence for rounds, guesses, scores, and match history.
6. Add organizer content management, storage, and moderation states.
7. Add team play and then competitive variants on top of the stable shared session model.

**Closed from the original delivery plan**
- Formalize a reusable round-state model.
- Update docs for local development and product setup.
- Replace the placeholder board with Leaflet.
- Add multi-round solo session flow and cumulative scoring.
- Create a small curated round pack.

## Issue-Ready Milestones
- `docs/product/issues/milestone-1-playable-solo-mvp.md`
- `docs/product/issues/milestone-2-hosted-multiplayer-core.md`
- `docs/product/issues/milestone-3-content-operations-and-persistence.md`
- `docs/product/issues/milestone-4-team-play-and-competitive-extensions.md`

## Risks
- Real-time multiplayer may force architectural changes if introduced before round state is clearly modeled.
- User-submitted images create moderation and privacy obligations that should not be opened before operational tooling exists.
- Delaying the Node.js service contract or its real-time model could stall Milestone 2 sequencing and force duplicate client work.
- Advanced modes like streaks or time attack can create scoring and UX rework if added before the base loop is stable.

## Decisions To Lock Early
- Reuse the current client round/session model as the starting contract for hosted play.
- Treat hosted synchronous play as the primary MVP mode.
- Start with a curated approved image set before opening submissions.
- Use a Node.js service as the Milestone 2 backend for authoritative room/session control, scoring, and real-time updates.

## Evidence
- Product scope and feature candidates come from `docs/product/spec-sheet.txt`.
- The current implementation baseline comes from `src/App.tsx`, `src/components/MapBoard.tsx`, `src/game/rounds.ts`, `src/game/session.ts`, and `src/game/scoring.ts`.
- The current repo is frontend-only, based on `package.json`, with no backend or persistence dependencies present.