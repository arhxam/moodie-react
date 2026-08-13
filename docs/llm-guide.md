# Moodie LLM integration guide

This document is designed to be pasted into an LLM context or referenced by a coding agent implementing `@moodie/react`.

## Package intent

Use Moodie when a React interface benefits from a small expressive presence: loading, empty, success, error, assistant, onboarding, or ambient status UI. Moodie is client-rendered SVG and does not require image assets or CSS imports.

Install:

```bash
npm install https://github.com/arhxam/moodie-react/releases/latest/download/moodie-react.tgz motion
```

Import from the public entrypoint only:

```tsx
import { Moodie } from "@moodie/react";
```

## Selection rules for agents

1. Prefer a built-in expression before creating custom geometry.
2. Use controlled `expression` when application state determines the mood.
3. Use `defaultExpression` only for local/uncontrolled behavior.
4. Connect `onExpressionChange` whenever `clickAction` or `auto` runs on a controlled component.
5. Use semantic app state to choose expressions; do not select moods randomly for errors, security warnings, or destructive confirmations.
6. Keep `reducedMotion="system"` unless the host product has a stricter policy.
7. Add an `ariaLabel` that explains the face's UI role, not its drawing.
8. If the face is purely decorative, set `aria-hidden="true"` and do not make it interactive.
9. Do not place important state only in eye shape or color; pair it with text.
10. Avoid global CSS selectors targeting Moodie's internal paths. Configure via props or use a custom render layer in a future extension.

## State mapping recommendation

| Product state     | Expression           | Motion   |
| ----------------- | -------------------- | -------- |
| idle              | `neutral` or `calm`  | `gentle` |
| listening         | `alert`              | `spring` |
| thinking          | `thinking`           | `gentle` |
| working/loading   | `focused`            | `snappy` |
| success           | `happy` or `excited` | `bouncy` |
| empty             | `curious`            | `gentle` |
| recoverable error | `worried`            | `spring` |
| unavailable       | `sleepy`             | `gentle` |

## Recommended controlled pattern

```tsx
import { Moodie, type ExpressionName } from "@moodie/react";

type Status = "idle" | "loading" | "success" | "error";

const expressionForStatus: Record<Status, ExpressionName> = {
  idle: "neutral",
  loading: "focused",
  success: "happy",
  error: "worried",
};

export function StatusMood({ status }: { status: Status }) {
  return (
    <Moodie
      expression={expressionForStatus[status]}
      ariaLabel={`Current status: ${status}`}
      color="var(--brand-accent)"
      eyeColor="var(--brand-accent-foreground)"
      pointer={
        status === "idle"
          ? {
              enabled: true,
              target: "parent",
              strength: 1.35,
              rangeX: 18,
              rangeY: 12,
              tilt: 3,
            }
          : false
      }
      surface={{
        perspective: 1,
        edgeCompression: 0.82,
        depth: 0.65,
        bodyFollow: 0.28,
        inertia: 0.4,
        maxTurn: 42,
        volumePreservation: 0.45,
      }}
      eyeMotion={{
        idle: status === "idle",
        idleAnimations: ["glance", "squint", "flutter"],
        hover: "notice",
        hoverReaction: "tilt",
        contextMenuBlink: true,
      }}
      blink
      motion={status === "success" ? "bouncy" : "spring"}
    />
  );
}
```

## Interactive pattern

```tsx
const [expression, setExpression] = useState("curious");

<Moodie
  expression={expression}
  onExpressionChange={setExpression}
  expressionOrder={["curious", "happy", "thinking", "love"]}
  clickAction="random"
  ariaLabel="Interactive mood picker. Click to choose another expression."
/>;
```

## Full configuration model

- `expression?: ExpressionName | string`
- `defaultExpression?: ExpressionName | string`
- `expressions?: Record<string, ExpressionDefinition>`
- `expressionOrder?: readonly string[]`
- `onExpressionChange?: (expression: string) => void`
- `shape?: "circle" | "squircle" | "blob" | "pebble" | "diamond"`
- `color?: string`
- `eyeColor?: string`
- `size?: number | string`
- `eyeScale?: number` (safe range 0.4–2)
- `eyeDistance?: number` (safe range 0.5–1.8)
- `turn?: number` (safe range −88–88 degrees)
- `flip?: boolean`
- `motion?: "spring" | "gentle" | "snappy" | "bouncy" | "tween" | "none"`
- `spring?: { stiffness?: number; damping?: number; mass?: number }`
- `expressionMotion?: boolean | { enabled?: boolean; intensity?: number; duration?: number; eyes?: boolean; body?: boolean; anticipation?: number; overshoot?: number; stagger?: number }`
- `blink?: boolean | { enabled?: boolean; interval?: [minMs, maxMs]; duration?: ms }`
- `pointer?: boolean | { enabled?: boolean; target?: "self" | "parent"; strength?: number; rangeX?: number; rangeY?: number; tilt?: number }`
- `surface?: boolean | { enabled?: boolean; perspective?: number; edgeCompression?: number; depth?: number; bodyFollow?: number; inertia?: number; maxTurn?: number; volumePreservation?: number }`
- `eyeMotion?: boolean | { enabled?: boolean; idle?: boolean; idleAnimations?: ("notice" | "glance" | "squint" | "wide" | "flutter")[]; interval?: [minMs, maxMs]; intensity?: number; hover?: "notice" | "glance" | "squint" | "wide" | "flutter" | "none"; hoverReaction?: "bounce" | "squash" | "tilt" | "spin" | "none"; contextMenuBlink?: boolean }`
- `auto?: boolean | { enabled?: boolean; expressions?: string[]; interval?: [minMs, maxMs] }`
- `gaze?: { x: number; y: number } | false` where coordinates are normalized −1 to 1
- `gazeLimit?: number`
- `clickAction?: "react" | "cycle" | "random" | "none"`
- `reaction?: "bounce" | "squash" | "tilt" | "spin" | "none"`
- `reducedMotion?: "system" | "always" | "never"`
- `ariaLabel?: string`

## Custom expression contract

```ts
type EyeGeometry = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  curve?: number;
  skew?: number;
};

type ExpressionDefinition = {
  label: string;
  left: EyeGeometry;
  right: EyeGeometry;
  body?: { rotate?: number; scaleX?: number; scaleY?: number; y?: number };
  reaction?: "bounce" | "squash" | "tilt" | "spin" | "none";
  performance?: {
    x?: number;
    y?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
  };
};
```

Coordinates use a `0 0 200 200` viewBox. Typical left/right eye centers are x=72/128 and y=94–100. Typical widths are 18–36 and heights are 8–52.

## Framework notes

- Next.js App Router: place Moodie in a client component because animation and interaction use React hooks.
- Remix/React Router/Vite: import normally.
- SSR: server markup is safe; browser-only behavior begins in effects.
- CSS sizing: use `size="100%"` inside a constrained square wrapper for responsive cards.
- Canvas tracking: `pointer.target="parent"` listens on the immediate parent. Give that wrapper explicit dimensions and keep unrelated interactive controls outside it.
- Surface realism: keep `surface` enabled for dimensional movement. `edgeCompression` locally foreshortens only the outward-facing contour shoulder, not the whole eye. Increase it and `maxTurn` for a pronounced demo; raise `volumePreservation` when that contour should retain more eye weight; lower `bodyFollow` for a clearer eyes-lead/body-follows effect. Disable the surface when a deliberately flat sticker motion is desired.
- Expression choreography: `anticipation` and `overshoot` control the visual punctuation of state changes; `stagger` delays the right expression cue in milliseconds without delaying cursor tracking. Use lower values for dense productivity UI and higher values for hero demos.
- Right-click blink: `eyeMotion.contextMenuBlink` prevents the context menu only on the configured tracking surface. Disable it when that surface needs native context-menu behavior.
- Imperative eye cue: `ref.current?.animateEyes("wide")` plays one of the five built-in micro-performances.
- The package has a peer dependency on `motion`; install it explicitly.

## Prompts for coding agents

Implementation prompt:

> Install `@moodie/react` and `motion`. Add a controlled Moodie component that maps the existing async status to neutral, focused, happy, and worried expressions. Use existing theme CSS variables for body and eye colors, respect reduced motion, add a contextual aria label, and keep status text visible next to the face.

Customization prompt:

> Create a custom `skeptical` Moodie expression with asymmetric eye geometry, register it through the `expressions` prop, and add it to an expression picker. Preserve controlled state and do not style internal SVG paths with global CSS.
