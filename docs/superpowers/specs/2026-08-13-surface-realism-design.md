# Surface Realism Design

## Goal

Upgrade Moodie's gaze and expression animation from flat translation to a lightweight, configurable pseudo-3D surface model that matches the supplied reference's edge behavior while preserving the SVG component, current dashboard design, accessibility, and reduced-motion support.

## Reference Findings

The 30.75-second, 60 fps reference uses several related techniques:

- Eyes travel on a curved surface rather than across a flat plane. Near the top or bottom, their vertical axis compresses; near the sides, their horizontal axis compresses.
- The eye nearer an edge compresses sooner and more strongly than the other eye, creating depth without a 3D renderer.
- Curved travel slows as it reaches the silhouette, and the eyes remain contained inside the body.
- Direction changes have inertia: the eyes lead, the body follows with less travel, and both settle through a small overshoot instead of stopping together.
- Expression changes have phases—anticipation, arrival, overshoot, and settle—and the two eyes do not resolve at precisely the same instant.
- Reduced states remain visually legible during every intermediate frame; paths never collapse into malformed geometry.

## Approaches Considered

### 1. CSS-only transforms

Translate and scale the existing eye group based on gaze. This is small, but it can only compress both eyes along global axes and cannot model the correct radial compression at corners. Rejected because it retains the flat look called out in the request.

### 2. Canvas or WebGL

Render a true sphere and project eye decals. This offers physical depth but would replace the accessible, inspectable SVG, increase bundle and runtime cost, complicate color/shape morphing, and weaken server-rendering compatibility. Rejected as disproportionate.

### 3. SVG surface projection

Project each eye path independently onto an inferred curved body surface. Apply radial foreshortening to eye vertices, depth-scale the farther eye, clip the pair to the body silhouette, and use separate eye/body springs. Selected because it creates the reference behavior with deterministic geometry and no new runtime dependency.

## Architecture

### Surface geometry

\`packages/moodie/src/surface-projection.ts\` will own pure geometry:

- \`SurfaceConfig\` and normalization.
- \`projectEyeOnSurface()\` to move an eye along a bounded curved trajectory.
- Per-vertex radial compression so the compressed axis rotates naturally around corners.
- Depth scaling and small tangential rotation derived from gaze.
- Stable 12-command cubic paths compatible with existing path morphing.

The function will accept the resolved eye geometry, side, gaze, travel ranges, eye scale/distance, and static \`turn\`. It returns the final eye path plus observable projection metadata for tests and diagnostics.

### Component choreography

\`Moodie\` will add \`surface?: boolean | Partial<SurfaceConfig>\`. Surface projection is enabled by default. Existing pointer range and gaze props remain authoritative, preserving backwards compatibility.

Eyes and body will use different motion transitions:

- Eyes use the existing selected spring with a slightly lighter mass so they acquire the target quickly.
- The body follows a configurable fraction of gaze with heavier damping and smaller displacement.
- The eye paths themselves morph through the same topology, preventing tearing.
- A unique animated clip path keeps extreme custom configurations inside the silhouette.

The surface configuration includes:

- \`enabled\`
- \`perspective\` (curved travel strength)
- \`edgeCompression\`
- \`depth\`
- \`bodyFollow\`
- \`inertia\`
- \`maxTurn\`

All fields are finite, clamped, documented, provider-compatible, serializable, and available in the demo and generated code.

### Expression transitions

\`ExpressionMotionConfig\` will gain \`anticipation\`, \`overshoot\`, and \`stagger\`. The cue will use five stages:

1. neutral
2. small counter-motion
3. target arrival
4. restrained overshoot
5. settle

The second eye gets the configured stagger delay. Body reactions remain bounded and reduced-motion mode renders the final expression immediately.

### Demo

The existing black-and-white dashboard, layout, content hierarchy, and independent sidebar scrolling remain unchanged. New shadcn sliders and a switch will be added inside the existing Behavior/Motion groups for surface realism, edge compression, depth, body follow, inertia, anticipation, overshoot, and eye stagger. Defaults will make edge behavior obvious enough to record without producing deformation.

## Safety and Performance

- No animation-frame loop or new global listener is introduced.
- Pointer coordinates remain clamped before projection.
- All projection math handles zero dimensions and non-finite user values.
- Paths retain a stable command count so Motion can interpolate without topology changes.
- Reduced motion disables spring choreography while retaining the correct final projected pose.
- The component remains asset-free and adds no dependency.

## Testing

- Unit tests prove normalization ranges and shorthand behavior.
- Geometry tests prove stable topology, finite coordinates, center-state parity, stronger compression near edges, rotated compression at corners, and bounded paths.
- Component tests prove configuration attributes, clipping, parent tracking, reduced motion, and backwards-compatible defaults.
- Demo tests prove generated React and JSON include every realism option.
- Browser QA covers center, four edges, corner reversal, expression change, right-click blink, desktop/mobile layout, console health, and the production custom domain.

## Release

Ship the additive public API as \`@moodie/react\` 0.3.0, update README, changelog, and LLM guide, merge through GitHub CI, deploy Vercel production, and verify \`https://moodie.arhamamin.com\`.
