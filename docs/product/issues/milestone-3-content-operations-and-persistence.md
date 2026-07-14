# Milestone 3: Content Operations And Persistence

## Outcome
Make GeoGuesstimator operational by persisting gameplay results and enabling organizers to manage approved content without editing code.

## Why This Milestone Exists
The product cannot scale beyond demos until content and scores are durable, queryable, and operationally manageable.

## In Scope
- Persistent storage for rounds, sessions, guesses, and scores
- Organizer/admin workflows for round creation and editing
- Managed image storage
- Moderation states for playable content
- Match history and basic leaderboard views
- Optional lightweight identity support if needed for durable history

## Out Of Scope
- Full profile systems
- Moderation automation
- Award and email workflow integrations

## Status
Not started.

## Closed Work Items
- None yet.

## Open Work Items
- [ ] Define persistence schema for rounds, sessions, guesses, and results.
- [ ] Add storage-backed read and write flows for completed gameplay.
- [ ] Add organizer tooling for round metadata and image management.
- [ ] Add moderation state gates for live-play eligibility.
- [ ] Expose basic historical leaderboard and match views.
- [ ] Add lightweight player identity if anonymous play is no longer sufficient.

## Implementation Notes
- The repo does not yet include a database layer, asset storage integration, organizer tooling, or persisted gameplay history.
- This milestone depends on Milestone 2 session contracts before storage and moderation workflows can be finalized cleanly.

## Dependencies
- Milestone 2 hosted session contracts
- Chosen storage providers for database and image assets

## Risks
- Data model rework if team and competitive features were not anticipated.
- Operational friction if moderation workflow is underspecified.

## Acceptance Criteria
- Organizers can publish playable content without code changes.
- Completed session results can be retrieved after the session ends.
- Unapproved content cannot be used in live gameplay.