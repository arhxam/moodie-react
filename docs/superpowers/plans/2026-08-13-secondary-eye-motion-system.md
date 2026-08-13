# Secondary Eye Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seven polished, interruptible secondary eye performances, expression-driven triggers, and an in-demo performance launcher without changing the established page layout.

**Architecture:** Keep gaze, surface projection, and expression morphing on their existing SVG layers. Extend the shared eye-performance transform layer with opacity-aware cues whose first keyframe inherits the currently rendered value and whose last keyframe always restores the neutral transform. Normalize expression-to-cue mappings in configuration, trigger them from expression changes, and expose the same cue catalog through the existing imperative handle and the existing scrollable inspector.

**Tech Stack:** React 19, TypeScript 5.9, Motion 13, Vitest, Testing Library, Vite, shadcn/Radix UI, npm workspaces.

---

## Task 1: Reconcile the shared branch with the public release

**Files:**

- Merge target: `origin/master`
- Preserve: `packages/moodie/src/geometry.ts`, shape tests, shape docs, and demo shape controls from commit `5a1d3f2`
- Align: `packages/moodie/package.json`, `apps/demo/package.json`, `package-lock.json`

- [ ] Fetch `origin` and inspect `git status --short` so no uncommitted shared work is overwritten.
- [ ] Merge `origin/master` into the current branch, resolving duplicate synchronization changes in favor of the already released behavior while retaining the eleven-shape feature.
- [ ] Run `npm install --package-lock-only` if the workspace dependency or lockfile needs reconciliation.
- [ ] Run `npm test -- --run` and `npm run typecheck`; expect the reconciled baseline to pass before motion work starts.
- [ ] Commit the reconciliation separately if the merge does not create its own commit.

## Task 2: Define the expanded cue and trigger contract with failing tests

**Files:**

- Modify: `packages/moodie/test/eye-motion.test.ts`
- Modify: `packages/moodie/test/config.test.ts`
- Modify: `packages/moodie/src/config.ts`
- Modify: `packages/moodie/src/eye-motion.ts`

- [ ] Add cue-contract tests asserting the catalog contains `roll`, `vanish`, `orbit`, `doubleTake`, `recoil`, `droop`, and `shake` in addition to the existing five cues.
- [ ] Add tests asserting every transform and opacity track has the same length as `transition.times`, starts with `null` to inherit the current pose, ends at neutral/full opacity, stays finite and bounded, and lasts between 0.28s and 1.2s.
- [ ] Add specific tests that `vanish` reaches opacity and scale zero, `orbit` travels in both axes, and intensity zero preserves a neutral cue.
- [ ] Add configuration tests for the default expression mappings (`cheeky → roll`, `dizzy → orbit`, `surprised → recoil`, `sleepy → droop`, `alert → doubleTake`), valid overrides, `none`, and rejection of invalid cue names.
- [ ] Run `npm test -- --run packages/moodie/test/eye-motion.test.ts packages/moodie/test/config.test.ts`; expect failures for the missing contract.
- [ ] Extend `EYE_ANIMATION_NAMES`, add `ExpressionEyeTrigger` and `expressionTriggers` to `EyeMotionConfig`, and normalize user mappings on top of the defaults.
- [ ] Add `opacity` and nullable first keyframes to `EyeAnimationCue`; implement the seven cues with matched, bounded tracks and neutral endings.
- [ ] Run the focused tests again; expect them to pass.
- [ ] Commit: `feat: expand the secondary eye motion catalog`.

## Task 3: Make playback interruption-safe and expression-aware

**Files:**

- Modify: `packages/moodie/test/moodie.test.tsx`
- Modify: `packages/moodie/src/moodie.tsx`

- [ ] Add component tests proving every new cue can be invoked through `MoodieHandle.animateEyes`, a later cue immediately supersedes the active cue, stale completion timers cannot clear the newer cue, and disabling/reduced motion restores `data-eye-animation="none"`.
- [ ] Add tests proving expression changes run the configured default cue, an explicit override runs instead, and `none` suppresses an expression trigger; the initial render must not fire a trigger.
- [ ] Run `npm test -- --run packages/moodie/test/moodie.test.tsx`; expect the new tests to fail.
- [ ] Remove the forced neutral `controls.set` before playback so nullable keyframes inherit the rendered pose.
- [ ] Add a monotonically increasing playback id, clear the prior timer, and only allow the current playback to clear `activeEyeAnimation`.
- [ ] Trigger the normalized expression cue inside the existing expression-change performance effect without changing gaze or eye-shape morph timing.
- [ ] Ensure disabling eye motion cancels the timer, invalidates active playback, and resets transform plus opacity.
- [ ] Run the component tests; expect them to pass without act warnings introduced by the new timers.
- [ ] Commit: `feat: trigger interruptible eye performances`.

## Task 4: Add the compact playground launcher and generated configuration

**Files:**

- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/lib/playground.test.ts`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/components/playground/config-inspector.tsx`

- [ ] Add playground tests that the public cue list includes all twelve cues and that generated JSX/JSON contains the documented `expressionTriggers` mapping.
- [ ] Run `npm test -- --run apps/demo/src/lib/playground.test.ts`; expect failures.
- [ ] Derive `EYE_ANIMATIONS` from the package cue catalog where practical, retaining `none` only for hover selection.
- [ ] Add a local `previewEyeAnimation` state and `MoodieHandle` ref in `Playground`; wire a stable callback to `animateEyes`.
- [ ] Add one compact “Performance cue” select and “Play cue” button to the existing Behavior control group, leaving the two-column studio and page styling unchanged.
- [ ] Pass the default expression trigger mapping into the live component and serialize it in generated JSX/JSON.
- [ ] Run the focused playground tests and `npm run typecheck`; expect both to pass.
- [ ] Commit: `feat: add an eye performance playground`.

## Task 5: Document the public API and release it as a minor version

**Files:**

- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `docs/llm-guide.md`
- Modify: `apps/demo/public/llms.txt`
- Modify: `CHANGELOG.md`
- Modify: `packages/moodie/package.json`
- Modify: `apps/demo/package.json`
- Modify: `package-lock.json`

- [ ] Document all cue names, `animateEyes`, hover/idle configuration, expression trigger defaults, `none` overrides, interruption behavior, and a copy-ready trigger example.
- [ ] Update the LLM-facing docs with the exact type names and advise keeping disruptive cues such as `vanish` opt-in for idle playback.
- [ ] Add a v0.4.0 changelog entry covering both the eleven shape additions and the secondary eye-motion system.
- [ ] Set `@moodie/react` and the demo workspace dependency to `0.4.0`, then regenerate the lockfile with npm.
- [ ] Run `npm run format:check`, `npm test -- --run`, `npm run typecheck`, and `npm run build`; expect all to pass.
- [ ] Commit: `release: prepare v0.4.0`.

## Task 6: Browser-QA motion, accessibility, and layout

**Files:**

- Test only; fix the smallest relevant source file if an issue is found.

- [ ] Start the production-like preview and open the site in the browser agent.
- [ ] Confirm the existing black-and-white UI and studio layout are unchanged, the right inspector remains independently scrollable, and the new launcher is reachable by keyboard.
- [ ] Play every cue twice, including rapid `roll → vanish → orbit` interruptions; confirm no snap, stuck opacity, delayed second eye, or deformation outside the eye-performance layer.
- [ ] Change cheeky, sleepy, surprised, and other mapped expressions; confirm the automatic cue is obvious, smooth, and settles completely.
- [ ] Move the pointer across the full stage during cue playback; confirm both eyes remain synchronized and local outer-edge compression still affects only the outside contour.
- [ ] Verify console errors, reduced-motion behavior, right-click blink, double-right-click shape cycle, responsive viewport behavior, and no horizontal overflow.
- [ ] Capture screenshots for wide and mobile viewports and compare the resting frame before/after to catch visual drift.
- [ ] If fixes are needed, add a regression test first, apply the focused fix, rerun the full verification commands, and commit the correction.

## Task 7: Publish GitHub release and production deployment

**Files:**

- GitHub release artifact generated from `packages/moodie`
- Vercel production project `moodie-react`

- [ ] Review `git diff origin/master...HEAD`, confirm only intended shared shape/motion/release changes, and verify the worktree is clean.
- [ ] Push the current branch and open a pull request against `master` with test and browser-QA evidence.
- [ ] Merge only after required checks pass, then tag `v0.4.0` on the merged master commit.
- [ ] Run `npm pack --workspace @moodie/react`, verify tarball contents with `npm pack --dry-run`, and attach the versioned package artifact plus `moodie-react.tgz` alias to the GitHub release.
- [ ] Deploy the merged master commit to Vercel production and verify `https://moodie.arhamamin.com` resolves to that deployment.
- [ ] Run a production canary: load the page, play cues, switch expressions, inspect console/network errors, and confirm the GitHub release install link is public.

## Plan self-review

- The plan covers all approved cue names, code triggers, expression triggers, idle safety, interruption semantics, demo access, generated examples, LLM docs, browser QA, GitHub release, and production deployment.
- Nullable keyframes are consistently represented in the cue type and tested across every animated property, including opacity.
- Shared shape work is explicitly preserved and released alongside the new motion system.
- No placeholder file names, pseudo-APIs, or unresolved product decisions remain.
