# Natural Eye Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add canvas-wide gaze tracking, natural hover and idle eye performances, and right-click blinking as configurable Moodie behaviors.

**Architecture:** Normalize pointer-target and eye-motion settings in `config.ts`, generate composable Motion targets in a new pure `eye-motion.ts` module, and let `Moodie` resolve either its SVG or parent as the event surface. Keep gaze, eye performance, expression performance, and blinking in separate nested SVG groups so animations cannot overwrite one another.

**Tech Stack:** React 19, TypeScript, Motion, Vitest, Testing Library, Vite, Vercel.

---

### Task 1: Configuration contract

**Files:**

- Modify: `packages/moodie/test/config.test.ts`
- Modify: `packages/moodie/src/config.ts`
- Modify: `packages/moodie/src/index.ts`

- [ ] **Step 1: Write failing normalization tests**

Add assertions that `normalizePointer(true)` includes `target: "self"`, and that `normalizeEyeMotion(true)` returns the documented defaults. Add invalid-input coverage using cast values and verify target fallback, interval sorting, intensity clamping, and removal of unsupported idle animation names.

```ts
expect(normalizePointer(true).target).toBe("self");
expect(normalizeEyeMotion(true)).toMatchObject({
  enabled: true,
  idle: true,
  idleAnimations: ["glance", "squint", "flutter"],
  interval: [2400, 5200],
  intensity: 1,
  hover: "notice",
  hoverReaction: "tilt",
  contextMenuBlink: true,
});
expect(
  normalizeEyeMotion({
    interval: [9000, 20],
    intensity: 99,
    idleAnimations: ["wide", "invalid", "wide"],
  } as never),
).toMatchObject({
  interval: [500, 9000],
  intensity: 2,
  idleAnimations: ["wide"],
});
```

- [ ] **Step 2: Verify the tests fail for missing API**

Run: `npm test -- packages/moodie/test/config.test.ts`

Expected: FAIL because `normalizeEyeMotion`, `EyeMotionConfig`, and pointer `target` do not exist.

- [ ] **Step 3: Implement the minimal normalized types**

Add `PointerTrackingTarget`, `EyeAnimationName`, and `EyeMotionConfig`; extend `PointerConfig`; add `DEFAULT_CONFIG.eyeMotion`; and implement:

```ts
export function normalizeEyeMotion(
  config: boolean | Partial<EyeMotionConfig> = true,
): EyeMotionConfig;
```

The normalized return shape is:

```ts
return {
  enabled: config.enabled ?? true,
  idle: config.idle ?? true,
  idleAnimations: normalizeEyeAnimations(config.idleAnimations),
  interval: normalizeRange(config.interval, DEFAULT_CONFIG.eyeMotion.interval),
  intensity: clamp(config.intensity, 0, 2, DEFAULT_CONFIG.eyeMotion.intensity),
  hover: isEyeAnimation(config.hover)
    ? config.hover
    : config.hover === "none"
      ? "none"
      : DEFAULT_CONFIG.eyeMotion.hover,
  hoverReaction: isReactionName(config.hoverReaction)
    ? config.hoverReaction
    : DEFAULT_CONFIG.eyeMotion.hoverReaction,
  contextMenuBlink: config.contextMenuBlink ?? true,
};
```

Use the existing `clamp` and `normalizeRange` helpers. Filter and de-duplicate `idleAnimations`, falling back to the default list when the filtered result is empty.

- [ ] **Step 4: Export and verify**

Export the new types and normalizer from `packages/moodie/src/index.ts` and rerun the focused test. Expected: PASS.

### Task 2: Pure eye-performance cues

**Files:**

- Create: `packages/moodie/src/eye-motion.ts`
- Create: `packages/moodie/test/eye-motion.test.ts`
- Modify: `packages/moodie/src/index.ts`

- [ ] **Step 1: Write failing cue tests**

Test `createEyeAnimationCue(name, intensity)` for `notice`, `glance`, `squint`, `wide`, and `flutter`. Assert every cue starts and ends neutral, uses matching keyframe lengths, and doubles translation/scale deltas when intensity increases from `1` to `2`.

```ts
for (const name of ["notice", "glance", "squint", "wide", "flutter"] as const) {
  const cue = createEyeAnimationCue(name, 1);
  expect(cue.x?.[0]).toBe(0);
  expect(cue.x?.at(-1)).toBe(0);
  expect(cue.scaleY?.[0]).toBe(1);
  expect(cue.scaleY?.at(-1)).toBe(1);
  expect(cue.transition).toMatchObject({ duration: expect.any(Number) });
}
expect(createEyeAnimationCue("glance", 2).x).toEqual([0, -12, 8, 0]);
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- packages/moodie/test/eye-motion.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement deterministic cue generation**

Return a `TargetAndTransition`-compatible object with `x`, `y`, `scaleX`, `scaleY`, `rotate`, and a short times-based transition. Build deltas through helpers so intensity scales movement without scaling the neutral value `1`.

```ts
export const createEyeAnimationCue = (
  name: EyeAnimationName,
  intensity = 1,
): EyeAnimationCue => {
  const amount = clamp(intensity, 0, 2);
  const cue = EYE_CUES[name];
  return {
    x: cue.x.map((value) => value * amount),
    y: cue.y.map((value) => value * amount),
    scaleX: cue.scaleX.map((value) => 1 + (value - 1) * amount),
    scaleY: cue.scaleY.map((value) => 1 + (value - 1) * amount),
    rotate: cue.rotate.map((value) => value * amount),
    transition: { duration: cue.duration, times: cue.times, ease: cue.ease },
  };
};
```

- [ ] **Step 4: Verify GREEN**

Run the focused test and export `createEyeAnimationCue`. Expected: PASS.

### Task 3: Component event surface and animation runtime

**Files:**

- Modify: `packages/moodie/test/moodie.test.tsx`
- Modify: `packages/moodie/src/moodie.tsx`

- [ ] **Step 1: Write failing component tests**

Add separate tests proving:

```tsx
<div data-testid="stage">
  <Moodie pointer={{ target: "parent", strength: 1 }} />
</div>
```

tracks a pointer fired on the parent, recenters on leave, reports hover state, prevents `contextmenu` and blinks, exposes `animateEyes("wide")`, and suppresses hover performance under `reducedMotion="always"`.

```ts
vi.useFakeTimers();
render(
  <div data-testid="stage">
    <Moodie
      pointer={{ target: "parent", strength: 1 }}
      eyeMotion={{ hover: "notice", contextMenuBlink: true }}
      blink={{ duration: 100 }}
    />
  </div>,
);
const stage = screen.getByTestId("stage");
vi.spyOn(stage, "getBoundingClientRect").mockReturnValue(rect(400, 200));
fireEvent.pointerMove(stage, { clientX: 400, clientY: 0 });
expect(screen.getByRole("img")).toHaveAttribute("data-gaze-x", "1");
fireEvent.pointerEnter(stage);
expect(screen.getByRole("img")).toHaveAttribute("data-eye-animation", "notice");
const contextMenu = createEvent.contextMenu(stage);
fireEvent(stage, contextMenu);
expect(contextMenu.defaultPrevented).toBe(true);
expect(screen.getByRole("img")).toHaveAttribute("data-blinking", "true");
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- packages/moodie/test/moodie.test.tsx`

Expected: FAIL on the new data attributes, parent tracking, context-menu behavior, and handle method.

- [ ] **Step 3: Implement shared tracking helpers and listeners**

Add an internal SVG ref, a stable coordinate-to-gaze callback, and an effect that attaches `pointermove`, `pointerenter`, `pointerleave`, and `contextmenu` listeners to `parentElement` only when `pointer.target === "parent"`. Preserve the existing consumer SVG event handlers in self mode.

```ts
useEffect(() => {
  if (!pointerConfig.enabled || pointerConfig.target !== "parent") return;
  const target = svgRef.current?.parentElement;
  if (!target) return;
  const move = (event: PointerEvent) =>
    updateGaze(event.clientX, event.clientY, target);
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerenter", enter);
  target.addEventListener("pointerleave", leave);
  target.addEventListener("contextmenu", contextMenu);
  return () => {
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerenter", enter);
    target.removeEventListener("pointerleave", leave);
    target.removeEventListener("contextmenu", contextMenu);
  };
}, [pointerConfig.enabled, pointerConfig.target, updateGaze]);
```

- [ ] **Step 4: Implement composable eye controls**

Add `eyeControls`, `activeEyeAnimation`, `isHovered`, and `playEyeAnimation`. Nest a new `data-part="eye-performance"` group inside gaze translation. Reset controls before every cue, clear active state after its duration, schedule idle cues with cleanup, and add `animateEyes` to `MoodieHandle`.

```tsx
<motion.g
  data-part="eye-performance"
  animate={eyeControls}
  style={{ transformOrigin: "100px 96px" }}
>
  <motion.g data-part="expression-cue" animate={expressionControls}>
    {eyes}
  </motion.g>
</motion.g>
```

- [ ] **Step 5: Verify GREEN and cleanup**

Run the component and package test suites. Expected: PASS with no act warnings.

### Task 4: Demo controls and generated configuration

**Files:**

- Modify: `apps/demo/src/lib/playground.test.ts`
- Modify: `apps/demo/src/lib/playground.ts`
- Modify: `apps/demo/src/components/playground/playground.tsx`
- Modify: `apps/demo/src/components/playground/config-inspector.tsx`

- [ ] **Step 1: Write failing exporter tests**

Assert the initial demo uses `pointerTarget: "parent"` and generated React/JSON include complete `pointer` and `eyeMotion` objects with hover, idle, intensity, interval, and context-menu settings.

```ts
expect(INITIAL_CONFIG.pointerTarget).toBe("parent");
expect(createCode(INITIAL_CONFIG)).toContain('target: "parent"');
expect(createCode(INITIAL_CONFIG)).toContain(
  'eyeMotion={{ enabled: true, idle: true, hover: "notice", hoverReaction: "tilt", contextMenuBlink: true, intensity: 1, interval: [2400, 5200] }}',
);
expect(JSON.parse(createJson(INITIAL_CONFIG)).eyeMotion).toMatchObject({
  hover: "notice",
  contextMenuBlink: true,
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- apps/demo/src/lib/playground.test.ts`

Expected: FAIL because the demo config lacks the new fields.

- [ ] **Step 3: Implement demo state and controls**

Pass `target` and `eyeMotion` to `Moodie`. Add shadcn select/switch controls for tracking area, idle eye motion, hover eye cue, and right-click blink. Update the stage hint and accessible label to teach the interactions.

```tsx
pointer={{
  enabled: config.pointer,
  target: config.pointerTarget,
  strength: config.pointerStrength,
  rangeX: config.pointerRangeX,
  rangeY: config.pointerRangeY,
  tilt: config.pointerTilt,
}}
eyeMotion={{
  enabled: config.eyeMotion,
  idle: config.idleEyeMotion,
  hover: config.hoverEyeMotion,
  hoverReaction: config.hoverReaction,
  contextMenuBlink: config.contextMenuBlink,
  intensity: config.eyeMotionIntensity,
  interval: [config.eyeMotionIntervalMin, config.eyeMotionIntervalMax],
}}
```

- [ ] **Step 4: Verify GREEN**

Rerun the exporter tests. Expected: PASS.

### Task 5: Public documentation and release metadata

**Files:**

- Modify: `README.md`
- Modify: `packages/moodie/README.md`
- Modify: `docs/llm-guide.md`
- Modify: `llms.txt`
- Modify: `apps/demo/public/llms.txt`
- Modify: `CHANGELOG.md`
- Modify: `packages/moodie/package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Document the new interaction model**

Add a complete `pointer.target` and `eyeMotion` example, right-click semantics, reduced-motion behavior, data attributes, and `animateEyes` handle method to consumer and LLM documentation.

```tsx
<Moodie
  pointer={{ target: "parent", strength: 1.5, rangeX: 22, rangeY: 15, tilt: 4 }}
  eyeMotion={{
    idle: true,
    idleAnimations: ["glance", "squint", "flutter"],
    hover: "notice",
    hoverReaction: "tilt",
    contextMenuBlink: true,
  }}
/>
```

- [ ] **Step 2: Prepare v0.2.0**

Set `@moodie/react` to `0.2.0`, refresh the lockfile mechanically, and add a v0.2.0 changelog section.

```json
{
  "name": "@moodie/react",
  "version": "0.2.0"
}
```

- [ ] **Step 3: Run static verification**

Run: `npm run format:check && npm run typecheck && npm test && npm run build && git diff --check`

Expected: all commands exit `0`; only the documented Vite chunk-size and low-severity development dependency warnings may remain.

### Task 6: Rendered QA, GitHub, release, and production

**Files:**

- No committed QA artifacts.

- [ ] **Step 1: Validate locally in Browser**

Run the demo and verify desktop plus 390×844: entering the canvas moves gaze before touching the face, hover reports and renders the notice cue, right-click blinks without a menu, idle cues occur, clicking still changes expression, geometry remains square, and console logs are clean.

- [ ] **Step 2: Publish through GitHub**

Commit intended files, push the existing branch, open a ready PR to `master`, wait for checks, merge it, and verify master CI succeeds.

- [ ] **Step 3: Publish and install v0.2.0**

Pack `@moodie/react`, publish `moodie-react.tgz` as the v0.2.0 GitHub release asset, and install the public latest-release URL into a blank temporary project. Expected: `Moodie`, `normalizeEyeMotion`, and `createEyeAnimationCue` import successfully.

- [ ] **Step 4: Deploy and verify production**

Deploy to Vercel production, verify the stable alias and public release return HTTP 200, repeat the Browser target flow on production, inspect a screenshot, check console health, and leave the production playground open as the deliverable tab.
