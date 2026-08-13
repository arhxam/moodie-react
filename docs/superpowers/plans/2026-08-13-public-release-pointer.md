# Public Release and Pointer Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the full Moodie source on a public canonical GitHub repository and make cursor tracking substantially stronger and completely configurable.

**Architecture:** Extend normalized pointer configuration with explicit eye travel and tilt controls, then render pointer motion in a dedicated nested group so it composes safely with expression and reaction animation. Update every consumer-facing link before renaming and publicizing the repository, then merge the verified branch into the default branch and redeploy from the canonical repository.

**Tech Stack:** React 19, TypeScript, Motion, SVG, Vitest, Testing Library, Vite, GitHub CLI, Vercel CLI.

---

### Task 1: Add pointer-performance configuration

**Files:**

- Modify: `packages/moodie/src/config.ts`
- Modify: `packages/moodie/test/config.test.ts`

- [ ] Add a failing test expecting `normalizePointer` to provide `strength: 1.35`, `rangeX: 18`, `rangeY: 12`, and `tilt: 3`, while clamping unsafe values.
- [ ] Run `npm test -- packages/moodie/test/config.test.ts` and confirm the new fields fail.
- [ ] Extend `PointerConfig`, `DEFAULT_CONFIG.pointer`, and `normalizePointer` with the four normalized controls.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Render stronger cursor movement

**Files:**

- Modify: `packages/moodie/src/moodie.tsx`
- Modify: `packages/moodie/test/moodie.test.tsx`

- [ ] Add failing component assertions for normalized gaze updates and a dedicated `pointer-performance` group.
- [ ] Render the pointer-performance group with configurable x/y travel, subtle body-relative tilt, and the selected motion transition.
- [ ] Preserve reduced motion, controlled gaze, pointer disablement, blink, and expression cue composition.
- [ ] Re-run the component tests and confirm they pass.

### Task 3: Demonstrate and export every cursor control

**Files:**

- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/lib/playground.test.ts`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/components/playground/config-inspector.tsx`

- [ ] Add failing exporter assertions for strength, `rangeX`, `rangeY`, and tilt.
- [ ] Add the four pointer fields to playground state and pass them into `Moodie`.
- [ ] Add accessible sliders for cursor sensitivity, horizontal travel, vertical travel, and cursor tilt.
- [ ] Include the complete pointer object in generated React and JSON.
- [ ] Re-run the exporter tests and confirm they pass.

### Task 4: Update canonical public links and documentation

**Files:**

- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `packages/moodie/package.json`
- Modify: `llms.txt`
- Modify: `apps/demo/public/llms.txt`
- Modify: `apps/demo/src/components/site-header.tsx`
- Modify: `apps/demo/src/components/sections/api-section.tsx`
- Modify: `docs/llm-guide.md`
- Modify: `CHANGELOG.md`

- [ ] Replace every public repository URL with `https://github.com/arhxam/moodie-react`.
- [ ] Document the new pointer configuration and provide a strong-tracking example.
- [ ] Update the changelog and machine-readable guides.
- [ ] Search the repository and confirm no consumer-facing `custom-icon` URL remains.

### Task 5: Verify, publish, merge, and deploy

**Files:**

- No source files unless verification exposes a defect.

- [ ] Run formatting, type checking, all tests, production builds, package dry-run, and diff checks.
- [ ] Browser-test cursor movement at opposite edges, all new controls, generated code, desktop/mobile framing, and console health.
- [ ] Commit and push the current feature branch.
- [ ] Rename the GitHub repository to `moodie-react`, set the description/homepage/topics, and change visibility to public.
- [ ] Mark PR 1 ready and merge it into `master` after green checks.
- [ ] Verify the public default branch contains `packages/moodie/src/moodie.tsx` without authentication.
- [ ] Connect Vercel to the renamed repository, deploy production from the final source, and run a production browser smoke test.
