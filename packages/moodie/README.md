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

<Moodie expression="happy" color="#5b6cff" />;
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
    strength: 1.35,
    rangeX: 18,
    rangeY: 12,
    tilt: 3,
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

Boolean shorthands work for `pointer`, `blink`, and `auto`.

`strength` controls how quickly gaze reaches its limit. `rangeX` and `rangeY` control eye travel in view-box units, while `tilt` adds a small directional lean to the face. Multiply the entire range with `gazeLimit` when one high-level control is preferable.

## Motion

```tsx
<Moodie
  motion="bouncy"
  spring={{ stiffness: 260, damping: 14, mass: 0.75 }}
  expressionMotion={{ intensity: 1.35, duration: 620 }}
/>
```

Every expression change performs a short body reaction and an expression-specific eye movement before settling. Tune it with `expressionMotion`, or pass `false` to disable the performance while keeping path morphing. `eyes` and `body` can also be toggled independently.

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
ref.current?.lookAt({ x: 0.5, y: -0.2 });
ref.current?.react("bounce");
ref.current?.setExpression("alert");
```

## Main props

| Prop                | Type                                                    | Default    |
| ------------------- | ------------------------------------------------------- | ---------- |
| `expression`        | `ExpressionName \| string`                              | controlled |
| `defaultExpression` | `ExpressionName \| string`                              | `neutral`  |
| `shape`             | `circle \| squircle \| blob \| pebble \| diamond`       | `circle`   |
| `color`             | CSS color                                               | `#5b6cff`  |
| `eyeColor`          | CSS color                                               | `#0a0a0a`  |
| `size`              | `number \| string`                                      | `240`      |
| `motion`            | `spring \| gentle \| snappy \| bouncy \| tween \| none` | `spring`   |
| `expressionMotion`  | `boolean \| Partial<ExpressionMotionConfig>`            | `true`     |
| `pointer`           | `boolean \| PointerConfig`                              | `true`     |
| `blink`             | `boolean \| BlinkConfig`                                | `true`     |
| `auto`              | `boolean \| AutoConfig`                                 | `false`    |
| `clickAction`       | `react \| cycle \| random \| none`                      | `react`    |
| `reducedMotion`     | `system \| always \| never`                             | `system`   |

All standard SVG props except the conflicting native `color` definition are forwarded.
