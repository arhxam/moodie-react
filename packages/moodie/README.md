# `@moodie/react`

A tiny animated face with a surprisingly deep configuration surface.

## Install

```bash
npm install https://github.com/arhxam/moodie-react/releases/latest/download/moodie-react.tgz motion
```

React 18 and 19 are supported through peer dependencies.

## Basic usage

```tsx
import { Moodie } from "@moodie/react";

<Moodie expression="happy" color="#dfff5b" />;
```

The component renders one accessible SVG with a body path and two eye paths. Set `ariaLabel` to describe its role in context.

## Expressions

Built-ins: `neutral`, `happy`, `excited`, `sleepy`, `sad`, `worried`, `thinking`, `love`, `curious`, `surprised`, `focused`, `cheeky`, `dizzy`, `calm`, `wink`, and `alert`.

Use the component in controlled mode:

```tsx
const [expression, setExpression] = useState("neutral");

<Moodie
  expression={expression}
  onExpressionChange={setExpression}
  clickAction="random"
/>;
```

Or uncontrolled mode:

```tsx
<Moodie defaultExpression="neutral" clickAction="cycle" />
```

## Behavior

```tsx
<Moodie
  pointer={{
    enabled: true,
    target: "parent",
    strength: 1.35,
    rangeX: 18,
    rangeY: 12,
    tilt: 3,
  }}
  surface={{
    enabled: true,
    perspective: 1,
    edgeCompression: 0.82,
    depth: 0.65,
    bodyFollow: 0.28,
    inertia: 0.4,
    maxTurn: 42,
    volumePreservation: 0.45,
  }}
  eyeMotion={{
    enabled: true,
    idle: true,
    idleAnimations: ["glance", "squint", "flutter"],
    interval: [2400, 5200],
    intensity: 1,
    hover: "notice",
    hoverReaction: "tilt",
    contextMenuBlink: true,
    expressionTriggers: {
      cheeky: "roll",
      surprised: "recoil",
      sleepy: "droop",
    },
  }}
  gazeLimit={1}
  blink={{ enabled: true, interval: [2200, 5600], duration: 140 }}
  auto={{
    enabled: true,
    expressions: ["neutral", "thinking", "happy"],
    interval: [2800, 5000],
  }}
/>
```

Boolean shorthands work for `pointer`, `surface`, `eyeMotion`, `blink`, and `auto`.

`strength` controls how quickly gaze reaches its limit. `rangeX` and `rangeY` control eye travel in view-box units, while `tilt` adds a small directional lean to the face. Multiply the entire range with `gazeLimit` when one high-level control is preferable. `target: "parent"` makes the SVG's immediate parent the tracking surface, which is useful for cards and full preview canvases; `"self"` is the backward-compatible default.

Eye motion is layered independently from gaze, expression morphs, and blinking. Built-in cues are `notice`, `glance`, `squint`, `wide`, `flutter`, `roll`, `vanish`, `orbit`, `doubleTake`, `recoil`, `droop`, and `shake`. Canvas entry starts tracking immediately, while hovering the face can play both an eye cue and a body reaction without changing the selected expression. With `contextMenuBlink`, right-clicking the configured tracking surface blinks and suppresses the browser menu. Explicit right-click and imperative blinks work even when automatic blink cadence is disabled.

Every cue begins from the currently rendered eye-performance pose, so a newer cue can interrupt an older one without snapping through neutral. Every sequence then restores neutral transform and full opacity. `vanish` intentionally reaches zero opacity and scale before returning; keep it and other large performances opt-in for idle motion.

Expression changes can trigger cues automatically. Defaults are `cheeky → roll`, `dizzy → orbit`, `surprised → recoil`, `sleepy → droop`, and `alert → doubleTake`. Override any mapping or suppress it with `"none"`:

```tsx
<Moodie
  expression={expression}
  eyeMotion={{
    expressionTriggers: {
      cheeky: "shake",
      sleepy: "none",
      focused: "doubleTake",
    },
  }}
/>
```

A rapid double right-click can cycle the body silhouette while preserving the single-right-click blink. Enable `doubleContextShapeCycle`, then use `defaultShape` for an internally managed starting shape or pair `shape` with `onShapeChange` for controlled state. `shapeOrder` changes the cycle order. The gesture is opt-in so existing context-menu behavior remains backward compatible.

### Surface realism

Surface projection makes the eye geometry behave as if it is attached to a rounded face instead of sliding like a flat sticker. At the edge, only the outward-facing contour shoulder foreshortens; the inward half remains stable instead of shrinking the whole eye. Horizontal, vertical, and diagonal gaze rotate that localized effect continuously. `depth` makes the near and far eye react differently, `maxTurn` adds directional yaw, and `bodyFollow` lets the face trail the faster eye motion. `volumePreservation` adds a subtle bounded expansion on the same outward contour so strong gaze retains appealing visual weight.

`perspective`, `edgeCompression`, `depth`, `bodyFollow`, `inertia`, and `volumePreservation` use a normalized range of `0` to `1` in typical use. `perspective` accepts up to `2` for a deliberately exaggerated demo, and `maxTurn` accepts `0` to `70` degrees. Pass `surface={false}` for the original flat translation behavior while retaining gaze tracking.

## Motion

```tsx
<Moodie
  motion="bouncy"
  spring={{ stiffness: 260, damping: 14, mass: 0.75 }}
  expressionMotion={{
    intensity: 1.35,
    duration: 620,
    anticipation: 0.35,
    overshoot: 0.25,
    stagger: 22,
  }}
/>
```

Every expression change performs anticipation, a decisive arrival, a small counter-overshoot, and a settle. Tune its energy with `intensity`, `anticipation`, and `overshoot`; tune timing with `duration` and the between-eye `stagger`. Stagger applies only to that expression cue, so pointer tracking always starts both eyes on the same frame. Pass `false` to disable the performance while keeping path morphing. `eyes` and `body` can also be toggled independently.

Use `motion="none"` for no transitions. The default `reducedMotion="system"` follows the user's OS setting. `"always"` and `"never"` are available when a host application needs an explicit policy; reduced motion suppresses expression performances.

## Custom expressions

Eye geometry uses viewBox-space values. The renderer clamps unsafe values and always emits topology-compatible paths.

```tsx
import { Moodie, createExpression } from "@moodie/react";

const skeptical = createExpression({
  label: "Skeptical",
  left: { x: 70, y: 96, width: 34, height: 10, rotation: 12, curve: 0.4 },
  right: { x: 130, y: 94, width: 20, height: 38, rotation: -8, curve: 0.8 },
  body: { rotate: -3 },
  reaction: "tilt",
  performance: { x: 6, y: -3, rotate: 7, scaleY: 0.82 },
});

<Moodie expression="skeptical" expressions={{ skeptical }} />;
```

## Shared defaults

```tsx
import { Moodie, MoodieProvider } from "@moodie/react";

<MoodieProvider value={{ color: "#111", eyeColor: "#fff", motion: "gentle" }}>
  <Moodie expression="happy" />
  <Moodie expression="focused" />
</MoodieProvider>;
```

Instance props override provider values.

## Imperative control

```tsx
const ref = useRef<MoodieHandle>(null);

<Moodie ref={ref} />;
ref.current?.blink();
ref.current?.animateEyes("wide");
ref.current?.animateEyes("roll");
ref.current?.animateEyes("vanish");
ref.current?.lookAt({ x: 0.5, y: -0.2 });
ref.current?.react("bounce");
ref.current?.setExpression("alert");
```

## Main props

| Prop                      | Type                                                    | Default    |
| ------------------------- | ------------------------------------------------------- | ---------- |
| `expression`              | `ExpressionName \| string`                              | controlled |
| `defaultExpression`       | `ExpressionName \| string`                              | `neutral`  |
| `shape` / `defaultShape`  | `ShapeName`                                             | `circle`   |
| `shapeOrder`              | `readonly ShapeName[]`                                  | all shapes |
| `onShapeChange`           | `(shape: ShapeName) => void`                            | —          |
| `doubleContextShapeCycle` | `boolean`                                               | `false`    |
| `color`                   | CSS color                                               | `#dfff5b`  |
| `eyeColor`                | CSS color                                               | `#151515`  |
| `size`                    | `number \| string`                                      | `240`      |
| `motion`                  | `spring \| gentle \| snappy \| bouncy \| tween \| none` | `spring`   |
| `expressionMotion`        | `boolean \| Partial<ExpressionMotionConfig>`            | `true`     |
| `pointer`                 | `boolean \| PointerConfig`                              | `true`     |
| `surface`                 | `boolean \| Partial<SurfaceConfig>`                     | `true`     |
| `eyeMotion`               | `boolean \| Partial<EyeMotionConfig>`                   | `true`     |
| `blink`                   | `boolean \| BlinkConfig`                                | `true`     |
| `auto`                    | `boolean \| AutoConfig`                                 | `false`    |
| `clickAction`             | `react \| cycle \| random \| none`                      | `react`    |
| `reducedMotion`           | `system \| always \| never`                             | `system`   |

All standard SVG props except the conflicting native `color` definition are forwarded.

Useful runtime attributes include `data-pointer-target`, `data-surface-enabled`, `data-surface-volume-preservation`, `data-left-eye-compression`, `data-right-eye-compression`, `data-hovered`, `data-eye-motion`, and `data-eye-animation`. Reduced motion suppresses automatic idle and hover performances while preserving stable geometry and explicit application state.

The package also exports `EYE_ANIMATION_NAMES`, `DEFAULT_EXPRESSION_EYE_TRIGGERS`, `EyeAnimationName`, `ExpressionEyeTrigger`, and `EyeAnimationCue` for typed controls and integrations.
