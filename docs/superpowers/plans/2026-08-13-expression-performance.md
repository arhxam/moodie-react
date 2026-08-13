# Expression Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Moodie expression change visually emphatic, semantically expressive, and free of unstable silhouette deformation.

**Architecture:** A pure performance module normalizes the public configuration and creates deterministic eye cue keyframes. Presets provide semantic performance targets, while `Moodie` owns separate animation controls for the outer body reaction and nested eye accent. Geometry remains topology-compatible but recenters organic point loops before path generation.

**Tech Stack:** React 19, TypeScript, Motion, SVG, Vitest, Testing Library, Vite.

---

### Task 1: Stabilize organic geometry

**Files:**

- Modify: `packages/moodie/src/geometry.ts`
- Test: `packages/moodie/test/geometry.test.ts`

- [ ] Add a failing test that extracts path bounds and requires every built-in body shape to remain centered near `(100, 100)` and inside the view box.
- [ ] Run `npm test -- packages/moodie/test/geometry.test.ts` and confirm the blob's vertical center assertion fails.
- [ ] Generate blob variation from a single bounded radius and recenter the point loop before creating the cubic path.
- [ ] Re-run the geometry test and confirm it passes.

### Task 2: Add expression performance primitives

**Files:**

- Create: `packages/moodie/src/expression-motion.ts`
- Modify: `packages/moodie/src/config.ts`
- Modify: `packages/moodie/src/presets.ts`
- Modify: `packages/moodie/src/index.ts`
- Test: `packages/moodie/test/expression-motion.test.ts`

- [ ] Add failing tests for clamped expression-motion configuration and expression-specific four-step eye cue keyframes.
- [ ] Run the focused test and confirm missing exports fail collection.
- [ ] Implement `normalizeExpressionMotion` and `createExpressionCue`, and add performance targets to the built-in presets.
- [ ] Export the new configuration and performance types from the package.
- [ ] Re-run the focused tests and confirm they pass.

### Task 3: Direct automatic expression performances

**Files:**

- Modify: `packages/moodie/src/moodie.tsx`
- Test: `packages/moodie/test/moodie.test.tsx`

- [ ] Add failing rendering tests for the nested expression cue layer and expression-motion state attributes.
- [ ] Run the focused component test and confirm the new cue layer assertions fail.
- [ ] Add separate eye animation controls, detect actual expression changes, trigger the semantic body reaction, and suppress the performance for reduced or disabled motion.
- [ ] Increase body reaction amplitudes while scaling them through normalized intensity.
- [ ] Re-run the component test and confirm it passes.

### Task 4: Expose expressiveness in the demo and docs

**Files:**

- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/lib/playground.test.ts`
- Modify: `apps/demo/src/components/playground/config-inspector.tsx`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `docs/llm-guide.md`

- [ ] Add a failing exporter assertion for the generated `expressionMotion` configuration.
- [ ] Add Expressiveness to demo state, controls, rendered props, React output, and JSON output.
- [ ] Document automatic expression performances and their opt-out/configuration API.
- [ ] Run the demo exporter test and confirm it passes.

### Task 5: Verify and ship

**Files:**

- Modify only if verification reveals an issue.

- [ ] Run `npm run format:check`, `npm run typecheck`, `npm test`, and `npm run build`.
- [ ] Start the local demo and verify expression switching, eye choreography, geometry, responsive rendering, and console health with the available Browser integration.
- [ ] Commit the intended diff and push the existing branch.
- [ ] Wait for GitHub and Vercel checks, deploy production, and verify the stable production URL.
