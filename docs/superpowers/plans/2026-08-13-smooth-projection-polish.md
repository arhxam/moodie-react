# Smooth Projection Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make edge gaze and rapid reversals preserve attractive eye volume and settle smoothly while keeping the existing SVG component and UI compatible.

**Architecture:** Refine the pure `surface-projection` geometry layer first, then tune the React motion transitions that consume it. Expose one additive normalized configuration value through the existing config, demo exporter, controls, and documentation, with browser QA against the live interaction flow.

**Tech Stack:** React 19, TypeScript, SVG paths, Motion, Vitest, Testing Library, Vite, shadcn, Vercel

---

## File structure

- `packages/moodie/src/surface-projection.ts`: pure surface magnitude, compression, tangential volume preservation, and depth projection.
- `packages/moodie/src/moodie.tsx`: eye/body transition damping and runtime attributes.
- `packages/moodie/src/expression-motion.ts`: shorter default eye staggering.
- `packages/moodie/test/surface-projection.test.ts`: attractive deformation and continuity regressions.
- `packages/moodie/test/moodie.test.tsx`: component configuration and reduced-motion regression.
- `apps/demo/src/lib/playground.ts`: demo defaults and generated React/JSON output.
- `apps/demo/src/lib/playground.test.ts`: synchronized exporter assertions.
- `apps/demo/src/components/playground/config-inspector.tsx`: volume-preservation control in the existing panel.
- `apps/demo/src/components/playground/playground.tsx`: pass the control into `Moodie`.
- `README.md`, `packages/moodie/README.md`, `docs/llm-guide.md`, `llms.txt`, `CHANGELOG.md`: public documentation and release notes.

### Task 1: Preserve attractive eye volume

**Files:**

- Modify: `packages/moodie/test/surface-projection.test.ts`
- Modify: `packages/moodie/src/surface-projection.ts`
- Modify: `packages/moodie/test/config.test.ts`

- [ ] **Step 1: Write failing projection tests**

Add assertions that the normalized surface contains `volumePreservation: 0.45`, the full horizontal edge keeps both eyes above `0.6` radial compression, `tangentScale` stays between `1` and `1.12`, disabling volume preservation returns `1`, and nearby diagonal gaze vectors change compression by less than `0.02`.

```ts
expect(normalizeSurface(true).volumePreservation).toBe(0.45);
expect(near.compression).toBeGreaterThan(0.6);
expect(near.tangentScale).toBeGreaterThan(1);
expect(near.tangentScale).toBeLessThanOrEqual(1.12);
expect(withoutVolume.tangentScale).toBe(1);
expect(Math.abs(diagonalA.compression - diagonalB.compression)).toBeLessThan(
  0.02,
);
```

- [ ] **Step 2: Verify the projection tests fail for the missing behavior**

Run: `npx vitest run packages/moodie/test/surface-projection.test.ts packages/moodie/test/config.test.ts`

Expected: FAIL because `volumePreservation` and `tangentScale` do not exist and the current near-eye compression is about `0.502`.

- [ ] **Step 3: Implement the smoother projection**

Add the public configuration and result fields:

```ts
export type SurfaceConfig = {
  enabled: boolean;
  perspective: number;
  edgeCompression: number;
  depth: number;
  bodyFollow: number;
  inertia: number;
  maxTurn: number;
  volumePreservation: number;
};

export type ProjectedEye = {
  path: string;
  center: Point;
  compression: number;
  depthScale: number;
  tangentScale: number;
  radialAxis: Point;
  turn: number;
};
```

Use a fourth-order directional magnitude and quintic smootherstep. Soften the compression, yaw shrink, and depth coefficients, then pass the bounded tangential scale into `transformPoint`:

```ts
const directionalMagnitude = Math.min(
  1,
  (Math.abs(gazeX) ** 4 + Math.abs(gazeY) ** 4) ** 0.25,
);
const edgeAmount = smootherstep(0.14, 1, directionalMagnitude);
const compression = clamp(
  1 - edgeCompression * edgeAmount * 0.4 * (1 + sideDepth * 0.1),
  0.5,
  1,
  1,
);
const tangentScale = clamp(
  1 + (1 - compression) * input.surface.volumePreservation * 0.32,
  1,
  1.12,
  1,
);
```

- [ ] **Step 4: Run focused projection tests**

Run: `npx vitest run packages/moodie/test/surface-projection.test.ts packages/moodie/test/config.test.ts`

Expected: both files pass with finite, bounded, topology-compatible paths.

- [ ] **Step 5: Commit the geometry behavior**

```bash
git add packages/moodie/src/surface-projection.ts packages/moodie/test/surface-projection.test.ts packages/moodie/test/config.test.ts
git commit -m "fix: preserve eye volume at face edges"
```

### Task 2: Smooth the settling response

**Files:**

- Modify: `packages/moodie/test/expression-motion.test.ts`
- Modify: `packages/moodie/test/moodie.test.tsx`
- Modify: `packages/moodie/src/expression-motion.ts`
- Modify: `packages/moodie/src/moodie.tsx`

- [ ] **Step 1: Write failing motion-default and component tests**

Assert the new default stagger is `22`, `data-surface-volume-preservation` is rendered, and reduced motion still resolves the eye transition immediately.

```ts
expect(DEFAULT_EXPRESSION_MOTION.stagger).toBe(22);
expect(face).toHaveAttribute("data-surface-volume-preservation", "0.45");
```

- [ ] **Step 2: Verify motion tests fail**

Run: `npx vitest run packages/moodie/test/expression-motion.test.ts packages/moodie/test/moodie.test.tsx`

Expected: FAIL on the old `35` millisecond default and missing runtime attribute.

- [ ] **Step 3: Implement damped transitions**

Set the default stagger to `22`. Keep user springs configurable while changing the eye multipliers toward a high-damping quick response and the body multipliers toward a slower near-critical response:

```ts
const eyeTransition = {
  type: "spring" as const,
  stiffness: springConfig.stiffness * (1.06 - surfaceConfig.inertia * 0.06),
  damping: springConfig.damping * (1.08 + surfaceConfig.inertia * 0.08),
  mass: springConfig.mass * (0.68 + surfaceConfig.inertia * 0.2),
};

const bodyTransition = {
  type: "spring" as const,
  stiffness: springConfig.stiffness * (0.82 - surfaceConfig.inertia * 0.12),
  damping: springConfig.damping * (1.12 + surfaceConfig.inertia * 0.18),
  mass: springConfig.mass * (1.08 + surfaceConfig.inertia * 0.72),
};
```

Expose the configured volume-preservation value as a runtime attribute beside the other surface diagnostics.

- [ ] **Step 4: Run focused motion tests**

Run: `npx vitest run packages/moodie/test/expression-motion.test.ts packages/moodie/test/moodie.test.tsx`

Expected: both files pass.

- [ ] **Step 5: Commit motion settling**

```bash
git add packages/moodie/src/expression-motion.ts packages/moodie/src/moodie.tsx packages/moodie/test/expression-motion.test.ts packages/moodie/test/moodie.test.tsx
git commit -m "fix: smooth gaze and body settling"
```

### Task 3: Expose the polish control and document v0.3.1

**Files:**

- Modify: `apps/demo/src/lib/playground.test.ts`
- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/components/playground/config-inspector.tsx`
- Modify: `packages/moodie/package.json`
- Modify: `apps/demo/package.json`
- Modify: `package-lock.json`
- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `docs/llm-guide.md`
- Modify: `llms.txt`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Write failing demo exporter tests**

Assert React and JSON output contain `volumePreservation: 0.45` and the initial stagger is `22`.

```ts
expect(code).toContain("volumePreservation: 0.45");
expect(parsed.surface.volumePreservation).toBe(0.45);
expect(parsed.expressionMotion.stagger).toBe(22);
```

- [ ] **Step 2: Verify demo tests fail**

Run: `npx vitest run apps/demo/src/lib/playground.test.ts`

Expected: FAIL because the demo model does not contain `surfaceVolumePreservation` and still exports `35` milliseconds.

- [ ] **Step 3: Wire the additive control**

Add `surfaceVolumePreservation: number` to `PlaygroundConfig`, default it to `0.45`, pass it to `surface.volumePreservation`, emit it in both exporters, and add a slider labeled `Volume preservation` with range `0–1` and step `0.05` in the existing surface section.

- [ ] **Step 4: Update package metadata and public guidance**

Set `@moodie/react` and the demo workspace dependency to `0.3.1`, refresh the lock mechanically with `npm install --package-lock-only`, add a `0.3.1` changelog entry, and document `surface.volumePreservation` in the repository README, package README, LLM guide, and `llms.txt`.

- [ ] **Step 5: Run focused demo tests and formatting**

Run: `npx vitest run apps/demo/src/lib/playground.test.ts && npx prettier --write <changed-files>`

Expected: exporter tests pass and all changed files format cleanly.

- [ ] **Step 6: Commit the public control and release metadata**

```bash
git add apps/demo packages/moodie/package.json package-lock.json README.md packages/moodie/README.md docs/llm-guide.md llms.txt CHANGELOG.md
git commit -m "feat: expose projection volume control"
```

### Task 4: Verify, release, and deploy

**Files:**

- Verify all changed files; no new production source file is required.

- [ ] **Step 1: Run the complete verification gate**

Run: `npm test && npm run typecheck && npm run build && npm run format:check && git diff --check && npm pack --dry-run --workspace @moodie/react`

Expected: 51 or more tests pass, declarations and demo build succeed, formatting is clean, and the package contains only README, `dist`, and package metadata.

- [ ] **Step 2: Run local browser QA**

Start `npm run dev`, reload the playground, and verify desktop `1440 × 1000` plus mobile `390 × 844`: center, horizontal edge, vertical edge, diagonal, rapid reversal, worried-expression switch, volume slider, no framework overlay, and no relevant app console errors. Capture before/after screenshots and record compression/depth values.

- [ ] **Step 3: Publish through GitHub**

Push the current branch, create a ready PR against `master`, wait for CI and Vercel preview, merge it, tag the merge commit `v0.3.1`, attach `moodie-react.tgz`, and smoke-install the latest GitHub release URL into a blank temporary project.

- [ ] **Step 4: Deploy and validate production**

Run `vercel deploy --prod --yes --logs`, verify `https://moodie.arhamamin.com` returns HTTP 200 and aliases to the ready deployment, then repeat the desktop/mobile browser interaction proof on production. Leave the production playground open as a deliverable tab.
