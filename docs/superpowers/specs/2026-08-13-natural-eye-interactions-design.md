# Natural Eye Interactions Design

## Goal

Make Moodie feel attentive before it feels animated: gaze should begin when a pointer enters the configured canvas, hover should produce a believable recognition cue, right-click should blink, and idle moments should include smooth eye micro-performances.

## Interaction contract

- `pointer.target` accepts `"self"` or `"parent"`. `"self"` preserves the existing package behavior; `"parent"` uses the SVG's immediate parent as the pointer surface.
- The demo uses `pointer.target: "parent"`, so the full preview canvas drives gaze as soon as the cursor enters it.
- Entering the tracking surface plays a configurable eye cue and optional body reaction. It does not unexpectedly change the selected expression.
- Right-clicking the tracking surface triggers an explicit blink and suppresses the browser context menu when `contextMenuBlink` is enabled.
- Leaving the surface smoothly returns gaze to center.
- Explicit pointer, context-menu, and imperative interactions remain available even when automatic blinking or idle animation is disabled.

## Public API

Add these exported types:

```ts
export type PointerTrackingTarget = "self" | "parent";

export type EyeAnimationName =
  | "notice"
  | "glance"
  | "squint"
  | "wide"
  | "flutter";

export type EyeMotionConfig = {
  enabled: boolean;
  idle: boolean;
  idleAnimations: readonly EyeAnimationName[];
  interval: readonly [number, number];
  intensity: number;
  hover: EyeAnimationName | "none";
  hoverReaction: ReactionName;
  contextMenuBlink: boolean;
};
```

`PointerConfig` gains `target`. `MoodieProps` gains `eyeMotion?: boolean | Partial<EyeMotionConfig>`. `MoodieHandle` gains `animateEyes(animation?: EyeAnimationName): void`.

Defaults favor restrained life rather than constant movement:

- pointer target: `"self"`
- idle cues: glance, squint, and flutter
- idle interval: 2400–5200ms
- intensity: `1`
- hover eyes: `"notice"`
- hover body: `"tilt"`
- right-click blink: enabled

All numeric values and animation lists are normalized. Invalid target or animation values fall back to documented defaults.

## Animation composition

Create a focused `eye-motion.ts` module that returns seek-safe Motion targets for each cue. A dedicated `eye-performance` SVG group sits inside gaze translation and outside expression/blink layers:

```text
pointer performance
└── body reaction
    ├── body
    └── gaze translation
        └── eye performance
            └── expression performance
                └── blink
```

The cues are deliberately short and organic:

- `notice`: lift and widen, then settle.
- `glance`: dart left, check right, settle.
- `squint`: compress vertically with a slight downward shift.
- `wide`: open wider with a small overshoot.
- `flutter`: two light eyelid pulses.

Intensity scales translations and scale deltas, while duration remains short enough to feel responsive. A new cue stops and resets the previous cue before starting, preventing accumulated transforms or deformation.

## Runtime behavior

The component owns one SVG ref and resolves the event surface from `pointer.target`. Native listeners are attached only for parent tracking; self tracking keeps React SVG handlers and consumer callbacks intact. Shared helpers convert pointer coordinates against the active surface bounds.

Idle scheduling uses one timeout, pauses while the document is hidden, avoids immediate repetition when multiple animations are available, and cleans up on unmount. Reduced-motion and `motion="none"` disable idle and hover performances while retaining centered geometry and explicit state APIs.

The rendered SVG exposes `data-pointer-target`, `data-hovered`, `data-eye-motion`, and `data-eye-animation` for testing and integrator styling/debugging.

## Demo and documentation

The playground defaults to canvas tracking and adds controls for tracking area, idle eye motion, hover eye cue, and right-click blink. Generated React and JSON output include complete `pointer` and `eyeMotion` objects. The stage hint explicitly teaches: enter to track, hover to react, right-click to blink.

README, package documentation, LLM guide, changelog, and `llms.txt` describe the new configuration and imperative method.

## Testing and acceptance

- Normalization tests cover defaults, clamping, filtering, and invalid values.
- Pure cue tests cover all eye animations and intensity scaling.
- Component tests prove parent-surface gaze, return-to-center, hover cue state, context-menu blink, cleanup, imperative eye animation, and reduced-motion suppression.
- Demo exporter tests prove generated code and JSON stay synchronized.
- Browser QA proves canvas-edge tracking, hover recognition, right-click blink, idle animation, expression composition, mobile geometry, and console health.
- Full formatting, typecheck, unit test, package build, demo build, GitHub CI, public release installation, and production HTTP checks must pass before completion.

