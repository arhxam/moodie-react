# Recording Square Arrival Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the landing playground reliably perform the recording sequence from circular cursor-tracking face to a fitted-eye square with a rightward roll and damped tremble.

**Architecture:** Pure demo configuration owns the circle-to-square order and fitted-eye transformation. The playground routes every shape change through one event path, while a keyed wrapper supplies website-only choreography and leaves the core package unchanged.

**Tech Stack:** React 19, TypeScript, Motion-powered Moodie component, CSS keyframes, Vitest, Testing Library, Vite, Vercel.

---

### Task 1: Recording configuration contract

**Files:**

- Create: `apps/demo/src/lib/recording-demo.ts`
- Create: `apps/demo/src/lib/recording-demo.test.ts`
- Modify: `apps/demo/src/lib/showcase.ts`
- Modify: `apps/demo/src/lib/showcase.test.ts`

- [ ] **Step 1: Write failing pure tests**

Assert that `RECORDING_SHAPE_ORDER` begins with `circle`, `square`; `applyRecordingShape(config, "square")` sets `shape: "square"`, `eyeScale: 0.82`, and `eyeDistance: 0.9`; non-square changes preserve eye geometry; unrelated pointer and spring fields are never changed. Assert the opening showcase hold is at least 10 seconds so the recording begins in the core state.

- [ ] **Step 2: Verify RED**

Run `npx vitest run apps/demo/src/lib/recording-demo.test.ts apps/demo/src/lib/showcase.test.ts` and expect missing-module and short-hold failures.

- [ ] **Step 3: Implement the pure contract**

Export `RECORDING_SHAPE_ORDER`, `SQUARE_EYE_SCALE`, `SQUARE_EYE_DISTANCE`, and `applyRecordingShape`. Set only the opening showcase step hold to `12_000` milliseconds and widen the showcase hold test's upper bound accordingly.

- [ ] **Step 4: Verify GREEN and commit**

Run the selected tests, expect all pass, then commit `feat: add recording square configuration`.

### Task 2: Square arrival interaction

**Files:**

- Modify: `apps/demo/src/components/playground/playground.test.tsx`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/index.css`

- [ ] **Step 1: Write the failing interaction test**

Render `Playground`, dispatch two context-menu events to the tracking stage inside the double-click threshold, and assert the Moodie SVG becomes `data-shape="square"`, the wrapper becomes `data-recording-performance="square-arrival"`, the status becomes `Manual mode`, and the generated controls reflect the fitted eye values.

- [ ] **Step 2: Verify RED**

Run `npx vitest run apps/demo/src/components/playground/playground.test.tsx` and expect the square-arrival assertions to fail.

- [ ] **Step 3: Implement the unified shape handler**

Pass `RECORDING_SHAPE_ORDER` to Moodie. Route `onShapeChange` and inspector `shape` updates through `applyRecordingShape`; on square, close the director, increment a wrapper key, and trigger `animateEyes("squint")` on the next animation frame. Extend pointer-entry pause to 30 seconds for recording.

- [ ] **Step 4: Add the keyed wrapper performance**

Wrap Moodie in `.demo-face-frame`. For square arrival, apply a 1.2-second transform sequence that moves right, rolls clockwise, rebounds, and settles through smaller alternating rotations. Add a `prefers-reduced-motion` rule that removes the transform animation.

- [ ] **Step 5: Verify GREEN and commit**

Run component tests plus typecheck, expect all pass, then commit `feat: choreograph demo square arrival`.

### Task 3: Verify and publish

**Files:**

- Modify: `CHANGELOG.md`
- Modify: `packages/moodie/package.json`
- Modify: `apps/demo/package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Prepare v0.5.1 metadata**

Document the recording sequence as a patch release and synchronize package versions to `0.5.1`.

- [ ] **Step 2: Run the full gate**

Run `npm test`, `npm run typecheck`, `npm run build`, `npm run format:check`, and `git diff --check`. Expect zero failures.

- [ ] **Step 3: Run rendered QA**

In the Browser plugin, verify desktop cursor gaze, single-right-click blink, double-right-click square conversion, fitted eye values, wrapper performance marker, terminal manual state, finite paths, clean console, and a 390×844 mobile viewport without horizontal overflow.

- [ ] **Step 4: Publish**

Push the current branch, open and merge a PR into `master` after CI, publish the `v0.5.1` GitHub archive, wait for the exact merge SHA's Vercel deployment, and repeat the recording interaction on `https://moodie.arhamamin.com`.

## Self-review

- Coverage: the plan includes the stable opening, cursor/blink preservation, direct square conversion, eye fit, rightward square motion, manual handoff, reduced motion, tests, and production proof.
- Placeholder scan: no deferred steps or ambiguous implementation markers remain.
- Type consistency: `RECORDING_SHAPE_ORDER`, `applyRecordingShape`, `SQUARE_EYE_SCALE`, and `SQUARE_EYE_DISTANCE` retain the same names across pure tests and playground integration.
