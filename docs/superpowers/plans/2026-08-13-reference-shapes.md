# Reference Shapes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six reference-matched, topology-compatible body shapes to the Moodie package and demo.

**Architecture:** Keep body geometry in `geometry.ts` and represent every built-in as a 16-point normalized loop converted by the existing cubic-path helper. Export one canonical shape-name tuple, then consume it in validation and the demo while preserving the existing `Moodie` rendering and state flow.

**Tech Stack:** React 19, TypeScript 5.9, SVG, Motion, Vitest, Testing Library, Vite.

---

## File map

- `packages/moodie/src/geometry.ts`: canonical shape names and 16-point silhouette generation.
- `packages/moodie/src/index.ts`: public shape-name export.
- `packages/moodie/test/geometry.test.ts`: path uniqueness, topology, fallback, and bounds coverage.
- `packages/moodie/test/moodie.test.tsx`: rendered new-shape coverage.
- `apps/demo/src/lib/playground.ts`: picker inventory and generated-code state.
- `apps/demo/src/lib/playground.test.ts`: picker and code-output assertions.
- `README.md`, `packages/moodie/README.md`, `docs/llm-guide.md`, `llms.txt`, `apps/demo/public/llms.txt`: consumer-facing shape inventory.

### Task 1: Lock the public geometry contract with failing tests

**Files:**

- Modify: `packages/moodie/test/geometry.test.ts`
- Modify: `packages/moodie/test/public-api.test.tsx`

- [ ] Add assertions that `SHAPE_NAMES` equals `circle`, `squircle`, `blob`, `pebble`, `diamond`, `oval`, `triangle`, `cloud`, `hexagon`, `square`, `drop`; that every generated path is unique; that each has 16 cubic commands; and that unknown values equal the `circle` path.
- [ ] Run `npm test -- packages/moodie/test/geometry.test.ts packages/moodie/test/public-api.test.tsx` and confirm failure because `SHAPE_NAMES` and the six paths do not exist.

### Task 2: Implement the six topology-compatible silhouettes

**Files:**

- Modify: `packages/moodie/src/geometry.ts`
- Modify: `packages/moodie/src/index.ts`

- [ ] Export `SHAPE_NAMES` as a const tuple and derive `ShapeName` from it.
- [ ] Add 16-point normalized loops for `oval`, `triangle`, `cloud`, `hexagon`, `square`, and `drop`, returning them through `createClosedPath` with silhouette-specific tension values.
- [ ] Keep the existing parametric generator unchanged for the original five names and retain `circle` fallback for unknown runtime strings.
- [ ] Run the focused geometry/public-API tests and confirm they pass.

### Task 3: Add component and playground coverage

**Files:**

- Modify: `packages/moodie/test/moodie.test.tsx`
- Modify: `apps/demo/src/lib/playground.test.ts`

- [ ] Add a parameterized component test that renders every new `shape` and asserts the SVG `data-shape` plus a non-empty body path.
- [ ] Add a playground test asserting `BODY_SHAPES` contains all `SHAPE_NAMES` and `createCode` preserves `shape="drop"`.
- [ ] Run `npm test -- packages/moodie/test/moodie.test.tsx apps/demo/src/lib/playground.test.ts` and confirm the playground assertion fails before its inventory is updated.

### Task 4: Expose the shapes in the demo

**Files:**

- Modify: `apps/demo/src/lib/playground.ts`

- [ ] Import `SHAPE_NAMES` from `@moodie/react` and define `BODY_SHAPES` from that canonical tuple so the existing inspector automatically displays every built-in.
- [ ] Run the focused component/playground tests and confirm they pass.

### Task 5: Synchronize public documentation

**Files:**

- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `docs/llm-guide.md`
- Modify: `llms.txt`
- Modify: `apps/demo/public/llms.txt`

- [ ] Change “Five body shapes” to “Eleven body shapes” and replace every exhaustive shape union/list with the 11 canonical values.
- [ ] Search the repository for stale exhaustive lists and confirm only historical design documents retain old wording.

### Task 6: Verify behavior and visual fidelity

**Files:**

- Modify only if verification reveals a mismatch.

- [ ] Run `npm test`, `npm run typecheck`, `npm run format:check`, and `npm run build`; require zero failures.
- [ ] Start the demo, select each new shape in the Body shape control, and confirm the live SVG plus generated JSX update.
- [ ] Capture a six-shape render at the reference's scale and inspect it with `view_image` alongside `.context/attachments/knMoQ2/Screenshot 2026-08-13 at 9.43.32 AM.png`.
- [ ] Compare silhouette, softness, centering, eye clearance, relative width/height, and ordering; adjust geometry and repeat verification until no material mismatch remains.
- [ ] Review `git diff origin/master...HEAD` and `git status --short` to ensure only intended work is included.

## Self-review

Every design requirement maps to a task: additive API and fallback (Tasks 1–2), demo flow (Tasks 3–4), documentation (Task 5), and automated plus visual verification (Task 6). The plan contains no unresolved placeholders, and all names/types are consistent with the design spec.
