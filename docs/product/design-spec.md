# GeoGuesstimator Product Design Spec

## Purpose
This document defines the shared visual language, interaction rules, and screen patterns for GeoGuesstimator. It should be the source of truth for how the product looks and feels as the solo prototype expands into hosted multiplayer, content operations, and post-game summaries.

## Design Direction
GeoGuesstimator should feel like an expedition control desk rather than a generic casual game. The interface combines atlas-inspired cartographic cues, warm paper surfaces, deep ocean map tones, and sharp signal accents so the product reads as strategic, playful, and location-driven across every screen.

## Product Personality
- Confident, clear, and competitive without feeling hostile.
- Editorial rather than toy-like.
- Fast to scan during live play.
- Warm and tactile, anchored by map and travel references.

## Experience Goals
- Make the primary action obvious within 3 seconds on any screen.
- Keep scoring, progression, and round state visible without crowding the play area.
- Ensure the clue, map, and reveal states always feel like parts of the same product.
- Preserve readability on mobile without reducing the experience to stacked gray cards.

## Visual System

### Color Roles
- `canvas`: warm sand background for the app frame.
- `canvas-accent`: lighter glow used in gradients and section framing.
- `surface`: translucent parchment panel for primary cards.
- `surface-strong`: denser version of the surface for tiles, stats, and grouped controls.
- `surface-ink`: dark navy surface used for map-adjacent or high-attention areas.
- `text`: standard body copy.
- `text-strong`: headings and key numeric values.
- `text-inverse`: text on dark surfaces.
- `accent-primary`: ember orange for core actions and emphasis.
- `accent-secondary`: gold for reveals, score highlights, and answer states.
- `accent-cool`: teal-blue for supporting indicators and map overlays.
- `border-soft`: default border for cards and dividers.
- `border-strong`: higher-contrast border for selected or emphasized states.
- `success`, `warning`, `danger`: reserved semantic states for validation and moderation flows.

### Typography
- Display and section headings use a serif family to reinforce the editorial travel tone.
- Body copy uses a humanist sans serif for legibility.
- Labels, pills, and overlines use a condensed uppercase treatment with generous tracking.
- Numerals for scores, round counts, and distances should visually stand out through weight and contrast.

### Shape And Depth
- Use rounded rectangles with medium-to-large radii. Avoid sharp-cornered enterprise panels.
- Large cards use a 24px radius. Small tiles and pills use fully rounded or 16px treatments.
- Shadows should feel soft and atmospheric, not dense or neon.
- Borders should do most of the separation work, with shadows used as support.

### Texture And Atmosphere
- Backgrounds can use subtle map-grid overlays, radial light blooms, and muted gradients.
- Decorative texture must never compete with clue imagery, map pins, or interactive labels.
- Map-related areas can lean cooler and darker than clue and summary surfaces.

### Motion
- Use short easing transitions for hover, reveal, and state shifts.
- Prefer 160ms to 240ms for standard interactions.
- Emphasize scale, lift, and glow subtly on interactive elements.
- Avoid constant looping motion or decorative animation during active guessing.

## Layout Rules

### Global Frame
- Max content width: 1200px.
- Desktop outer padding: 24px to 32px.
- Mobile outer padding: 12px to 16px.
- Default vertical spacing between major sections: 24px.

### Core Screen Structure
Every major gameplay screen should resolve into these regions in this order when present:
1. Context header: mode, round progress, score, or room information.
2. Primary play surface: clue, map, or answer reveal.
3. Action rail: submit, continue, retry, or host actions.
4. Secondary insight area: feedback, leaderboard, team status, or metadata.

### Responsive Behavior
- Desktop: favor a two-column split when clue and map must be visible together.
- Tablet: allow the secondary column to drop below the main surface while keeping score summary near the top.
- Mobile: preserve the header summary first, then stack clue, map, actions, and feedback in that order.
- Avoid placing critical actions below long descriptive copy on small screens.

## Component Patterns

### Header / Command Panel
- Contains the current mode, round count, total score, and one sentence of context.
- Use it at the top of active gameplay, live host, and end-of-game summary screens.
- Stats should appear in uniform tiles with consistent label treatment.

### Card Surface
- Primary container for clue content, map interaction, leaderboards, and results.
- Includes a header row with an overline, title, and optional status pill or metadata value.
- Use consistent internal spacing so cards feel related even when content differs.

### Status Pill
- Always map to a clear state: guessing, revealed, complete, waiting, locked, draft, approved.
- Use tint and text contrast rather than flashing or blinking.

### Action Buttons
- Primary action: filled ember-to-gold treatment.
- Secondary action: transparent or parchment fill with border.
- Destructive action: reserved for moderation or admin flows, not gameplay progression.
- Buttons should keep a consistent height and shape across screens.

### Data Tiles
- Used for round stats, score breakdowns, lobby info, and summary metrics.
- Label first, value second.
- Keep labels muted and uppercase; values strong and high contrast.

### Feedback / Reveal Panel
- Used for distance, points, actual answer, streak outcome, and session state.
- Reveal content should visually shift toward the gold secondary accent to distinguish it from the guessing state.

### Map Surface
- Cooler, darker surface than the rest of the UI.
- Pins, outlines, and overlays must remain legible above decorative map texture.
- Crosshair or interaction affordance should remain visible on both desktop and touch devices.

## Screen Guidance

### Solo Round Screen
- Prioritize clue and map together above detailed explanation.
- Keep round, total score, and phase in view at all times.

### Hosted Multiplayer Room
- Reuse the same command panel language as solo play.
- Distinguish host-only actions from player actions using grouping and label tone rather than separate visual systems.

### Leaderboard / Results
- Reuse data tiles and card surfaces.
- Highlight top performers with contrast and spacing, not novelty graphics.

### Content Operations Screens
- Reuse the same surface system and typography.
- Reserve semantic status colors for moderation states and approval workflow.

## Screen Wireframe Matrix

### Solo Round Wireframe
1. Command panel with mode, round progress, total score.
2. Left card for clue image, hint, and round description.
3. Right card for map interaction, active coordinates, and submit/reset actions.
4. Reveal strip below the map area for distance, points, and answer coordinates.

### End-Of-Game Summary Wireframe
1. Command panel switches from active round framing to final debrief framing.
2. Summary card shows final score, rounds cleared, average distance, and best round.
3. Results ledger lists each round with score, distance, and answer metadata.
4. Primary restart action sits inside the summary card rather than below the page fold.

### Hosted Multiplayer Room Wireframe
1. Command panel shows room code, host state, player count, and current phase.
2. Main card presents the active clue or waiting state.
3. Secondary card holds the map or the player submission state.
4. Lower rail contains player roster, ready states, and host controls.

### Player Join / Waiting Wireframe
1. Header confirms room and team context.
2. Primary card shows join code, player identity, and ready CTA.
3. Secondary card summarizes round rules, scoring, and hint policy.
4. Waiting roster remains visible without pushing the primary CTA off-screen.

### Leaderboard / Results Wireframe
1. Command panel anchors match metadata and winner summary.
2. Main surface uses ranked rows with consistent data-tile metrics.
3. Supporting surface can show round-by-round scoring swings or team breakdowns.
4. Top-ranked players get contrast and spacing emphasis, not a separate visual language.

### Content Operations Wireframe
1. Command panel shows library totals, moderation counts, and publish status.
2. Main list or grid uses shared cards with image preview, location metadata, and state pill.
3. Detail surface holds approval controls, map coordinates, and submission notes.
4. Destructive or moderation actions stay grouped and visually distinct from publish actions.

## Content And Tone
- Keep labels short and instructional.
- Prefer direct verbs: `Submit guess`, `Continue`, `Reveal answer`, `Start round`.
- Avoid joke copy or filler text in core gameplay flows.

## Accessibility Rules
- Body text must meet accessible contrast on every surface.
- Focus states must be visible on buttons, map interactions, and keyboard targets.
- Never rely on color alone to distinguish guess pins from answer pins or status states.
- Touch targets should remain comfortably tappable on mobile.

## Implementation Notes
- Theme values should live as semantic CSS tokens, not one-off hard-coded colors in component styles.
- New screens should compose from shared surfaces, tiles, pills, and button treatments before adding custom styling.
- Any new variant should justify why an existing token or pattern is insufficient.

## Current Theme Mapping
- Background frame uses the warm sand canvas with map-grid texture.
- Gameplay header uses the command panel pattern.
- Clue and map sections use the shared card surface.
- Round stats and reveal details use data tiles.
- Submit and continue controls use the primary and secondary button rules.