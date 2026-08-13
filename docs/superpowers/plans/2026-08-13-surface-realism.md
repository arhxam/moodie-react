# Surface Realism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Make Moodie's eyes feel attached to a curved, dimensional surface and make expression transitions feel intentionally choreographed, while keeping the SVG component lightweight and fully configurable.

**Architecture:** Add a pure surface-projection module that transforms stable eye point loops before path generation. Wire it into \`Moodie\` with an additive \`surface\` prop, separate eye/body transitions, and silhouette clipping; then expose the same settings in the existing demo and generated code.

**Tech Stack:** React 19, TypeScript, SVG, Motion for React, Vitest, Testing Library, Vite, shadcn/ui, Vercel.

---

## File Map

- Create \`packages/moodie/src/surface-projection.ts\`: normalization, curved travel, radial foreshortening, and projected-eye metadata.
- Create \`packages/moodie/test/surface-projection.test.ts\`: deterministic geometry and safety coverage.
- Modify \`packages/moodie/src/geometry.ts\`: expose stable eye point generation for projection reuse.
- Modify \`packages/moodie/src/config.ts\`: include surface defaults and normalization.
- Modify \`packages/moodie/src/expression-motion.ts\`: configurable anticipation, overshoot, and stagger.
- Modify \`packages/moodie/src/moodie.tsx\`: projected paths, separate inertia, clipping, diagnostics, and new prop.
- Modify \`packages/moodie/src/index.ts\`: export the additive public types and helpers.
- Modify \`packages/moodie/test/_.test._\`: component, config, public API, and transition regressions.
- Modify \`apps/demo/src/lib/playground.ts\`: demo state plus generated React/JSON.
- Modify \`apps/demo/src/components/playground/config-inspector.tsx\`: controls inside existing groups.
- Modify \`apps/demo/src/components/playground/playground.tsx\`: pass configured surface and choreography.
- Modify \`packages/moodie/README.md\`, \`docs/llm-guide.md\`, \`CHANGELOG.md\`, and package metadata: document and release the API.

### Task 1: Surface projection geometry

- [ ] **Step 1: Write failing geometry tests**

Add assertions that center gaze preserves the expression, edge gaze reduces radial eye span, horizontal and vertical edges compress different axes, the nearer eye receives stronger depth, every result remains finite, and every path keeps 12 cubic commands.

\`\`\`ts
const center = projectEyeOnSurface({ ...input, gaze: { x: 0, y: 0 } });
const right = projectEyeOnSurface({ ...input, gaze: { x: 1, y: 0 } });
expect(right.compression).toBeLessThan(center.compression);
expect(pathCommandCount(right.path)).toBe(12);
\`\`\`

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: \`npm test -- packages/moodie/test/surface-projection.test.ts\`

Expected: FAIL because the module and exports do not exist.

- [ ] **Step 3: Implement stable point projection**

Expose \`createEyePoints()\` from geometry, implement \`SurfaceConfig\`, \`DEFAULT_SURFACE_CONFIG\`, \`normalizeSurface()\`, \`curvedTravel()\`, and \`projectEyeOnSurface()\`. Clamp every input and round output coordinates to three decimals.

\`\`\`ts
export type SurfaceConfig = {
enabled: boolean;
perspective: number;
edgeCompression: number;
depth: number;
bodyFollow: number;
inertia: number;
maxTurn: number;
};
\`\`\`

- [ ] **Step 4: Run geometry and config tests and confirm GREEN**

Run: \`npm test -- packages/moodie/test/surface-projection.test.ts packages/moodie/test/geometry.test.ts packages/moodie/test/config.test.ts\`

Expected: all focused tests pass.

### Task 2: Component integration and transition choreography

- [ ] **Step 1: Write failing component and cue tests**

Assert that \`surface\` is normalized, projection diagnostics appear on the SVG, eyes are clipped to the active body path, edge pointer input changes each eye path independently, reduced motion retains geometry but removes choreography, and expression cues contain anticipation and overshoot stages.

- [ ] **Step 2: Run focused tests and confirm RED**

Run: \`npm test -- packages/moodie/test/moodie.test.tsx packages/moodie/test/expression-motion.test.ts\`

Expected: FAIL on missing surface prop/attributes and the old four-stage cue.

- [ ] **Step 3: Wire surface projection into Moodie**

Add \`surface?: boolean | Partial<SurfaceConfig>\`. Replace flat eye-group travel with separately projected left/right paths, add a unique animated clip path, calculate lighter eye and heavier body spring transitions from normalized inertia, and expose stable \`data-surface-*\` diagnostics.

- [ ] **Step 4: Enrich expression transitions**

Extend \`ExpressionMotionConfig\` with \`anticipation\`, \`overshoot\`, and \`stagger\`; emit five-stage cues with bounded counter-motion and settle; delay the right-eye path by configured milliseconds only when motion is enabled.

- [ ] **Step 5: Run component tests and confirm GREEN**

Run: \`npm test -- packages/moodie/test/moodie.test.tsx packages/moodie/test/expression-motion.test.ts packages/moodie/test/public-api.test.tsx\`

Expected: all focused tests pass.

### Task 3: Demo controls and generated configuration

- [ ] **Step 1: Write failing demo tests**

Extend playground expectations so React and JSON output include \`surface\` and the new expression choreography fields.

- [ ] **Step 2: Run the demo tests and confirm RED**

Run: \`npm test -- apps/demo/src/lib/playground.test.ts\`

Expected: FAIL because the generated output omits the new configuration.

- [ ] **Step 3: Add state and controls without redesigning the dashboard**

Add a Surface realism switch plus sliders for perspective, edge compression, depth, body follow, inertia, and maximum turn in Behavior. Add anticipation, overshoot, and eye stagger controls in Motion. Pass these values to Moodie and preserve the existing inspector structure, spacing classes, and independent scrolling.

- [ ] **Step 4: Update generated React and JSON**

Serialize all new values with two-decimal number formatting so copied configurations reproduce the preview exactly.

- [ ] **Step 5: Run demo tests and confirm GREEN**

Run: \`npm test -- apps/demo/src/lib/playground.test.ts apps/demo/src/lib/layout.test.ts\`

Expected: all focused tests pass.

### Task 4: Documentation and release metadata

- [ ] **Step 1: Update public documentation**

Document the \`surface\` object, defaults, edge-projection behavior, reduced-motion semantics, and transition fields in the package README and LLM guide. Add an upgrade example that uses parent-canvas tracking.

- [ ] **Step 2: Bump the additive release**

Set \`@moodie/react\` to \`0.3.0\`, update the lockfile mechanically with \`npm install --package-lock-only\`, and add a changelog entry describing surface projection and transition choreography.

- [ ] **Step 3: Run documentation and package checks**

Run: \`npm run format:check && npm pack --dry-run --workspace @moodie/react\`

Expected: formatting passes and the tarball contains the README, declarations, and built module.

### Task 5: Full verification and production release

- [ ] **Step 1: Run all automated gates**

Run: \`npm test && npm run typecheck && npm run build && npm run format:check && git diff --check\`

Expected: zero test, type, build, formatting, or whitespace failures.

- [ ] **Step 2: Run local browser QA**

Test \`/#playground\` at desktop and mobile widths. Move the pointer through center, left, right, top, bottom, and two corners; reverse direction quickly; change from happy to worried; right-click; and verify sidebar scrolling. Record path bounds/diagnostics, console health, screenshots, and a mismatch ledger against the supplied reference.

- [ ] **Step 3: Publish through GitHub**

Commit the scoped implementation, push the current branch, open a ready PR to \`master\`, wait for CI/Vercel preview, review the diff, and merge only after all checks pass.

- [ ] **Step 4: Release and deploy**

Publish \`@moodie/react@0.3.0\` if npm authentication is available, create the matching GitHub release, run \`vercel deploy --prod --yes --logs\`, and wait for the deployment to become ready.

- [ ] **Step 5: Verify the custom production domain**

Confirm Vercel reports \`moodie.arhamamin.com\` verified, DNS still resolves to \`76.76.21.21\`, HTTPS returns 200 with a valid certificate, and repeat the key desktop/mobile browser interaction on \`https://moodie.arhamamin.com/#playground\`.
