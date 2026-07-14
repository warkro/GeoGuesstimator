# Milestone 1: Playable Solo MVP

## Outcome
Ship a polished solo version of GeoGuesstimator with real map interaction, multiple rounds, cumulative scoring, and an end-of-game summary.

## Why This Milestone Exists
This milestone established the core round loop and interaction model that the hosted multiplayer build can now inherit.

## In Scope
- Replace the temporary world board with Leaflet.
- Add a reusable round-state model for start, guess, submit, reveal, continue, and complete.
- Support multi-round local sessions.
- Add a curated local round pack with several approved clues.
- Improve responsive behavior and accessibility of gameplay controls.
- Refresh the developer docs to reflect the actual project structure and commands.

## Out Of Scope
- Multiplayer synchronization
- Accounts or auth
- Organizer uploads
- Persistent leaderboards

## Status
Complete.

## Closed Work Items
- [x] Create a reusable local game session state model for multi-round play.
- [x] Update documentation for project layout and local usage.
- [x] Integrate Leaflet and map click handling.
- [x] Refactor gameplay into reusable UI surfaces around the session model.
- [x] Expand the local round pack to a five-round curated set.
- [x] Add end-of-game summary and cumulative score presentation.
- [x] Apply the planned UI/UX clarity pass, including improved map guidance.

## Open Work Items
- None within the original milestone scope.

## Implementation Notes
- The session state model in `src/game/session.ts` drives start, guess, reveal, continue, and complete phases.
- `src/App.tsx` now runs a five-round local session with cumulative scoring and a final summary screen.
- `src/components/MapBoard.tsx` provides the Leaflet-based map interaction surface.
- `src/game/rounds.ts` contains the current curated five-round local pack.

## Dependencies
- Stable scoring behavior from `src/game/scoring.ts`
- Clear round data structure for multiple clues

## Risks
- Later multiplayer work may still require small contract changes to the local session model.
- The current local round pack remains curated in code, so content scale is deferred to Milestone 3.

## Acceptance Criteria
- A player can complete 5 rounds without modifying code.
- Scores accumulate correctly and final totals are shown.
- Map interaction works on desktop and mobile.
- Keyboard focus and screen-readable labels exist for key controls.

## Exit Notes
- Milestone 1 is closed as implemented in the current repo.
- Any further solo-only polish should be treated as opportunistic regression cleanup, not as a blocker for hosted multiplayer planning.