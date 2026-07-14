# GeoGuesstimator

GeoGuesstimator is a hosted multiplayer React + TypeScript + Vite app backed by a small Node service. A host creates a room, players join with a short code, everyone plays the same photo round, and the server authoritatively scores map and situation submissions before broadcasting the reveal and leaderboard.

## Repo Layout

### App files
- `src/` contains the frontend application code.
- `server/` contains the Express + Socket.IO backend.
- `shared/` contains round, scoring, and multiplayer contracts used by both client and server.
- `public/` contains static assets served by Vite.
- `package.json`, `vite.config.ts`, `tsconfig*.json`, and `eslint.config.js` define the toolchain.

### Project and product files
- `docs/product/spec-sheet.txt` contains the original product brief.
- `docs/product/design-spec.md` defines the shared visual language and screen system.
- `docs/product/roadmap.md` contains the ranked roadmap and milestone plan.
- `docs/product/issues/` contains milestone-ready planning files that can be turned into tickets.
- `docs/engineering/` contains implementation-facing architecture and technical notes.
- `.github/agents/` contains the custom Product Manager and Implementation Engineer agents.

## Local Run

```bash
npm install
npm run dev
```

`npm run dev` starts both services:
- Vite frontend on `http://localhost:5173`
- Express + Socket.IO backend on `http://localhost:3001`

The Vite dev server proxies `/api` and `/socket.io` to the backend, so the browser still uses same-origin paths.

Other useful commands:

```bash
npm run dev:client
npm run dev:server
npm run build
npm run lint
```

`npm run build` typechecks the client config, compiles the backend to `server-dist/`, and builds the frontend to `dist/`.

## Render Deployment

This repo now deploys to Render as a web service instead of a static site.

Render settings:
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Environment: Node
- Service type: Web Service

In production, the backend serves the built Vite app from `dist/` and handles the `/api` and `/socket.io` traffic directly.

## Current State

The current MVP supports:
- host-created in-memory sessions with short join codes
- player join flow with lobby roster updates
- synchronized round progression across all connected clients
- server-authoritative round submissions and scoring
- round reveal and live leaderboard broadcasts
- final leaderboard for the current room

Current MVP limitations:
- no persistence or database
- no auth or moderation
- players can only join before the host starts the room
- room state is lost on server restart

Next planned work is tracked in `docs/product/roadmap.md`, with milestone breakdowns in `docs/product/issues/`.
