# Milestone 4: Team Play And Competitive Extensions

## Outcome
Expand GeoGuesstimator beyond core hosted play with team scoring and recurring-engagement features.

## Why This Milestone Exists
These features deepen replay value, but they should build on top of a stable shared-session and persistence foundation rather than redefining it.

## In Scope
- Team score aggregation and team leaderboard views
- Time attack and streak-style variants
- Weekly winner views
- Hint difficulty controls
- Post-game summaries designed for sharing or presentation

## Out Of Scope
- Poll integrations with external Microsoft tools
- Award workflow automation
- Deep social, badge, or profile systems

## Status
Not started.

## Closed Work Items
- None yet.

## Open Work Items
- [ ] Add team assignment and aggregation rules.
- [ ] Extend leaderboard logic to support team and individual perspectives.
- [ ] Add one competitive variant using existing round and scoring infrastructure.
- [ ] Add weekly winner windows and summary surfaces.
- [ ] Add configurable hint difficulty controls.
- [ ] Add presentation-friendly post-game output.

## Implementation Notes
- No team, competitive variant, weekly winner, or extended leaderboard functionality exists in the repo today.
- This milestone should stay fully deferred until hosted play and persistence are stable enough to avoid reworking result contracts.

## Dependencies
- Persistent results and organizer workflows from Milestone 3
- Stable shared scoring and leaderboard contracts

## Risks
- Variant-specific scoring rules may fragment the core model.
- Team and individual ranking views may diverge if result contracts are weak.

## Acceptance Criteria
- Teams can be ranked correctly from finalized round results.
- At least one competitive variant works without bypassing the core session model.
- Weekly and post-game views are generated from persisted results.