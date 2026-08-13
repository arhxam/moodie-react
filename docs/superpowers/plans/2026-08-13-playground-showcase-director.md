# Playground Showcase Director Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished autoplay showcase to the demo that choreographs Moodie's visual range, yields to interaction, can be permanently closed into manual mode, and ships as v0.5.0.

**Architecture:** An immutable pure-data sequence describes safe visual steps, while a focused React hook owns deterministic timer lifecycle. The playground applies automatic steps separately from manual updates, arbitrates scripted versus pointer gaze, and keeps the inspector as the source of truth. Moodie's SVG paths interpolate fill as part of their existing Motion transitions.

**Tech Stack:** React 19, TypeScript, Motion, Vitest fake timers, Testing Library, Vite, npm workspaces, GitHub CLI, Vercel CLI.

---

## File map

- Create `apps/demo/src/lib/showcase.ts`: showcase step types, curated steps, bounds-safe wrapping, and non-destructive config application.
- Create `apps/demo/src/lib/showcase.test.ts`: pure sequence, contrast, bounds, and preservation tests.
- Create `apps/demo/src/components/playground/use-showcase-director.ts`: running/paused/closed timer state machine.
- Create `apps/demo/src/components/playground/use-showcase-director.test.tsx`: timer lifecycle and cleanup tests.
- Modify `apps/demo/src/components/playground/playground.tsx`: sequence application, pointer arbitration, pause triggers, close control, and status.
- Modify `apps/demo/src/lib/playground.ts`: vivid initial palette that agrees with step zero.
- Modify `apps/demo/src/lib/playground.test.ts`: generated-output regression for the new default.
- Modify `apps/demo/src/index.css`: compact header controls and demo-state styling without changing the studio layout.
- Modify `packages/moodie/src/moodie.tsx`: interpolate body and eye fills with existing transitions.
- Modify `packages/moodie/src/moodie.test.tsx`: color rerender regression.
- Modify package metadata, lockfile, `CHANGELOG.md`, and `README.md`: v0.5.0 release and showcase documentation.

### Task 1: Curated showcase sequence

**Files:**
- Create: `apps/demo/src/lib/showcase.ts`
- Create: `apps/demo/src/lib/showcase.test.ts`
- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/lib/playground.test.ts`

- [ ] **Step 1: Write failing pure-data tests**

Test that `SHOWCASE_STEPS` has at least eight entries, step zero matches `INITIAL_CONFIG`, all gaze coordinates are between -1 and 1, scale/spacing values use the component's documented ranges, color pairs exceed 4.5 contrast, `nextShowcaseIndex(last)` returns zero, and `applyShowcaseStep` preserves non-showcase fields such as pointer strength and spring damping.

```ts
expect(SHOWCASE_STEPS.length).toBeGreaterThanOrEqual(8);
expect(SHOWCASE_STEPS[0]).toMatchObject({ color: INITIAL_CONFIG.color });
expect(nextShowcaseIndex(SHOWCASE_STEPS.length - 1)).toBe(0);
expect(applyShowcaseStep(custom, SHOWCASE_STEPS[1]).pointerStrength).toBe(1.8);
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npx vitest run apps/demo/src/lib/showcase.test.ts apps/demo/src/lib/playground.test.ts`

Expected: FAIL because `@/lib/showcase` does not exist and the old blue default does not match the planned palette.

- [ ] **Step 3: Implement the immutable sequence and helpers**

Define `ShowcaseStep` with `expression`, `shape`, `color`, `eyeColor`, `gaze`, `eyeScale`, `eyeDistance`, `cue`, and `hold`. Export a readonly authored sequence using public Moodie types, a modulo-based `nextShowcaseIndex`, and an `applyShowcaseStep` function that spreads the current config before overwriting only those visual fields. Change `INITIAL_CONFIG` to acid lime `#dfff5b` and deep ink `#151515`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npx vitest run apps/demo/src/lib/showcase.test.ts apps/demo/src/lib/playground.test.ts`

Expected: all selected tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/demo/src/lib/showcase.ts apps/demo/src/lib/showcase.test.ts apps/demo/src/lib/playground.ts apps/demo/src/lib/playground.test.ts
git commit -m "feat: add curated playground showcase sequence"
```

### Task 2: Deterministic director lifecycle

**Files:**
- Create: `apps/demo/src/components/playground/use-showcase-director.ts`
- Create: `apps/demo/src/components/playground/use-showcase-director.test.tsx`

- [ ] **Step 1: Write failing fake-timer hook tests**

Use `renderHook` and `vi.useFakeTimers()` to assert the initial state is running at index zero; the current hold advances exactly once; `pauseFor()` freezes advancement and resumes after `SHOWCASE_PAUSE_MS`; calling `pauseFor()` again replaces the resume timeout; `close()` remains closed after arbitrary time; `enabled: false` suppresses advancement; and unmount clears timers.

```ts
const { result } = renderHook(() => useShowcaseDirector({ holds: [1200, 1400] }));
act(() => vi.advanceTimersByTime(1200));
expect(result.current.index).toBe(1);
act(() => result.current.pauseFor(3000));
expect(result.current.status).toBe("paused");
```

- [ ] **Step 2: Run the hook test to verify RED**

Run: `npx vitest run apps/demo/src/components/playground/use-showcase-director.test.tsx`

Expected: FAIL because the hook module is missing.

- [ ] **Step 3: Implement the state machine**

Use one state object containing `status` and `index`, one advancement timeout, and one resume timeout. Schedule advancement only when running and enabled. `pauseFor(duration)` clears the resume timeout before scheduling a new one. `close()` clears both timeouts and enters terminal `closed`. Effects clear their owned timers during dependency changes and unmount.

- [ ] **Step 4: Run the hook test to verify GREEN**

Run: `npx vitest run apps/demo/src/components/playground/use-showcase-director.test.tsx`

Expected: all lifecycle tests PASS with no act warnings.

- [ ] **Step 5: Commit**

```bash
git add apps/demo/src/components/playground/use-showcase-director.ts apps/demo/src/components/playground/use-showcase-director.test.tsx
git commit -m "feat: add showcase director lifecycle"
```

### Task 3: Playground interaction and close handoff

**Files:**
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/index.css`

- [ ] **Step 1: Add a failing integration test**

Create a Testing Library test beside the playground that renders the component with fake timers and verifies `Demo running`, `Close demo`, a paused status after clicking a manual action, and `Manual mode` with no later automatic expression changes after closing.

- [ ] **Step 2: Run the integration test to verify RED**

Run: `npx vitest run apps/demo/src/components/playground/playground.test.tsx`

Expected: FAIL because the status and close button are absent.

- [ ] **Step 3: Wire the director into the playground**

Use the hook's index to apply steps directly, trigger each `cue` through `MoodieHandle.animateEyes`, and supply scripted `gaze` only when running and the pointer is outside `.face-stage`. Wrap every manual update, reset, randomize, preset selection, and performance preview in `pauseFor`. Stage pointer entry pauses and releases scripted gaze; pointer leave allows it to resume after the quiet period. Closing enters manual mode and preserves the current config.

- [ ] **Step 4: Add the minimal preview-header controls**

Keep the studio grid untouched. Add a small status pill and an outline `Close demo` button with an `XIcon` to `.preview-meta`; when closed, show a `Manual mode` pill. Add `aria-live="polite"`, explicit button labeling, focus-visible states, and responsive wrapping below 520px.

- [ ] **Step 5: Run integration and pure tests**

Run: `npx vitest run apps/demo/src/components/playground/playground.test.tsx apps/demo/src/components/playground/use-showcase-director.test.tsx apps/demo/src/lib/showcase.test.ts`

Expected: all selected tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/demo/src/components/playground/playground.tsx apps/demo/src/components/playground/playground.test.tsx apps/demo/src/index.css
git commit -m "feat: bring the playground to life automatically"
```

### Task 4: Smooth core palette transitions

**Files:**
- Modify: `packages/moodie/src/moodie.tsx`
- Modify: `packages/moodie/src/moodie.test.tsx`

- [ ] **Step 1: Write a failing rerender test**

Render Moodie with one palette, rerender with another, and assert the body and both eye motion paths receive the new fill target while retaining their `data-part` identity.

- [ ] **Step 2: Run the package test to verify RED**

Run: `npx vitest run packages/moodie/src/moodie.test.tsx -t "animates palette changes"`

Expected: FAIL because fill is currently a static SVG prop, not part of the Motion target.

- [ ] **Step 3: Add fill to existing Motion targets**

Add `fill: color` to the body path's `animate` object and `fill: eyeColor` to each eye path's `animate` object. Retain the static fill attributes as a no-JavaScript/fallback value and reuse existing body/eye transitions so reduced-motion behavior remains centralized.

- [ ] **Step 4: Run the package test to verify GREEN**

Run: `npx vitest run packages/moodie/src/moodie.test.tsx -t "animates palette changes"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/moodie/src/moodie.tsx packages/moodie/src/moodie.test.tsx
git commit -m "feat: animate Moodie palette transitions"
```

### Task 5: Release documentation and complete verification

**Files:**
- Modify: `packages/moodie/package.json`
- Modify: `apps/demo/package.json`
- Modify: `package-lock.json`
- Modify: `CHANGELOG.md`
- Modify: `README.md`

- [ ] **Step 1: Document the demo lifecycle and package behavior**

Add a short README section explaining that autoplay is a website showcase built from controlled public props, not a forced library default; visitors can interact to pause and close into manual configuration. Add a v0.5.0 changelog entry for the director, vivid palette, pointer arbitration, close handoff, and animated fills.

- [ ] **Step 2: Bump and synchronize package metadata**

Set `@moodie/react` and the demo's workspace dependency to `0.5.0`, then run `npm install --package-lock-only` so the lockfile is authoritative.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test
npm run typecheck
npm run build
npm run format:check
git diff --check
```

Expected: all tests pass, typecheck/build succeed, Prettier reports all files formatted, and diff check is silent.

- [ ] **Step 4: Run local browser QA**

Start the Vite server and verify at desktop and mobile widths: automatic gaze/form/palette changes without hover, cursor takeover on stage entry, click/manual pause and later resume, Close demo terminal behavior, inspector scrolling, generated code, no deformation regression, and no console errors.

- [ ] **Step 5: Commit the release**

```bash
git add packages/moodie/package.json apps/demo/package.json package-lock.json CHANGELOG.md README.md
git commit -m "chore: prepare Moodie v0.5.0"
```

- [ ] **Step 6: Publish GitHub and production**

Push the feature branch, open a PR against `master`, wait for CI, merge, create the `v0.5.0` GitHub release with `moodie-react.tgz`, deploy the merged commit to Vercel production, and verify `https://moodie.arhamamin.com` plus the release download URL.

- [ ] **Step 7: Run post-deploy canary**

Check the production homepage, autoplay state changes, Close demo behavior, browser console, GitHub release asset, and deployment commit. Report exact URLs and verification results.

## Self-review

- Spec coverage: autoplay, authored palettes, gaze/form/expression/cue changes, interaction pause, pointer takeover, Close demo terminal state, complete inspector handoff, reduced motion, fill interpolation, accessibility, docs, release, and production QA all map to tasks above.
- Placeholder scan: no deferred implementation markers or unspecified error-handling steps remain.
- Type consistency: `ShowcaseStep`, `SHOWCASE_STEPS`, `nextShowcaseIndex`, `applyShowcaseStep`, and `useShowcaseDirector({ holds })` are named consistently across tests and integration.
