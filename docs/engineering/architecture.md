# Architecture Overview

## Current Baseline
GeoGuesstimator is currently a frontend-only Milestone 1 build implemented with React, TypeScript, and Vite.

### Implemented
- Five-round solo gameplay flow and end-of-session summary in `src/App.tsx`
- Leaflet-based map interaction in `src/components/MapBoard.tsx`
- Local curated round data in `src/game/rounds.ts`
- Local multi-round session state in `src/game/session.ts`
- Local distance and scoring logic in `src/game/scoring.ts`
- Static image asset flow via Vite-managed frontend assets

### Not Yet Implemented
- Backend orchestration or real-time multiplayer
- Persistent storage for rounds, guesses, or scores
- Organizer/admin workflows for content management
- Authentication, moderation workflow, or deployment architecture

## Recommended Near-Term Architecture

### Frontend
- Continue using React + TypeScript.
- Reuse the shipped solo round/session model as the client contract seed for hosted play.
- Expand the current client into explicit host, player, waiting-room, reveal, and leaderboard states without forking gameplay rules from the solo build.

### Backend
- Add a Node.js service as the Milestone 2 backend for authoritative room/session control.
- Put room creation, join/leave, session start, round advancement, guess submission, reveal timing, and scoring behind that service.
- Use the Node.js service as the source of truth for real-time room updates so all connected clients render the same session state.

### Data And Storage
- Keep the existing curated round pack local for Milestone 2 while multiplayer authority is being introduced.
- Add persistence for sessions, guesses, scores, and managed round content in Milestone 3.
- Store approved clue images in managed object storage once organizer workflows and moderation states are introduced.

## Engineering Priorities
1. Define the shared room/session contract from the existing local session model.
2. Stand up the Node.js service for authoritative room control, scoring, and real-time updates.
3. Add host/player flows on top of the shared service contract.
4. Add persistence before advanced leaderboard, team, and competitive features.

## Locked Decisions
- Milestone 2 will use a Node.js service for authoritative room/session control and real-time updates.
- The current local round and session model is the starting contract for hosted multiplayer.
- Hosted synchronous play remains the primary MVP mode.

## Open Technical Decisions
- Real-time transport details within the Node.js service boundary
- Database choice for sessions, rounds, guesses, and results in Milestone 3
- Image storage provider for approved round assets
- Auth timing: anonymous/nickname first or account-backed earlier in the roadmap