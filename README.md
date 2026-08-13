# Moodie

[![CI](https://github.com/arhxam/moodie-react/actions/workflows/ci.yml/badge.svg)](https://github.com/arhxam/moodie-react/actions/workflows/ci.yml)
[![MIT licensed](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)

Give your interface a little life.

Moodie is a small, deeply configurable animated face for React. It projects topology-compatible SVG eyes across a curved face surface and animates them with spring physics, so gaze and expression changes feel dimensional without canvas, image assets, or a timeline editor.

**[Open the live playground](https://moodie.arhamamin.com)** · **[Read the LLM guide](docs/llm-guide.md)**

Install the package directly from the latest GitHub release:

```bash
npm install https://github.com/arhxam/moodie-react/releases/latest/download/moodie-react.tgz motion
```

```tsx
import { Moodie } from "@moodie/react";

export function LoadingState() {
  return (
    <Moodie
      expression="curious"
      color="#dfff5b"
      shape="blob"
      pointer
      blink
      clickAction="random"
    />
  );
}
```

## Why Moodie

- Smooth path morphing across 16 built-in expressions
- Automatic squash, rebound, and expression-specific eye performances
- Eleven body shapes and fully configurable CSS colors
- Pointer-following gaze, automatic blinking, and expression cycling
- Face-only or parent-canvas gaze with configurable sensitivity, travel, and tilt
- Curved-surface projection with edge compression, depth, body follow, and inertia
- Twelve interruptible eye performances, including roll, vanish, orbit, double-take, recoil, droop, and shake
- Configurable expression-to-performance triggers plus an imperative cue API
- Configurable hover recognition, idle micro-motion, right-click blinking, and double-right-click body cycling
- Spring, gentle, snappy, bouncy, tween, and no-motion modes
- Controlled or uncontrolled React state
- Custom expressions built from normalized eye geometry
- Imperative `blink`, `animateEyes`, `lookAt`, `react`, and `setExpression` methods
- SSR-safe and respectful of `prefers-reduced-motion`
- Typed, asset-free, ESM, and tree-shakeable

## Repository

This npm-workspaces repository contains:

- [`packages/moodie`](packages/moodie): the publishable React package
- [`apps/demo`](apps/demo): the shadcn-powered documentation and playground
- [`docs/llm-guide.md`](docs/llm-guide.md): integration context for coding agents
- [`llms.txt`](llms.txt): a compact machine-readable product/API overview

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

The demo opens at `http://localhost:5173` by default.

## Playground showcase

The website opens with an authored showcase built entirely from Moodie's public controlled props. It cycles through gaze, expressions, shapes, palettes, eye geometry, and secondary performances; entering the canvas or changing a control pauses the sequence so direct interaction stays in charge. **Close demo** stops the director for the current page session and leaves the full inspector in manual mode.

This choreography belongs to the demo, not the package runtime. A standalone `<Moodie />` remains predictable: opt into the built-in `auto`, `eyeMotion`, controlled `gaze`, or imperative APIs in the combinations your product needs.

## Core API

```tsx
<Moodie
  expression="happy"
  shape="squircle"
  color="rebeccapurple"
  eyeColor="white"
  size={240}
  motion="spring"
  spring={{ stiffness: 210, damping: 22, mass: 0.8 }}
  expressionMotion={{
    intensity: 1.35,
    duration: 620,
    anticipation: 0.35,
    overshoot: 0.25,
    stagger: 22,
  }}
  pointer={{
    enabled: true,
    target: "parent",
    strength: 1.35,
    rangeX: 18,
    rangeY: 12,
    tilt: 3,
  }}
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
    idle: true,
    idleAnimations: ["glance", "squint", "flutter"],
    hover: "notice",
    hoverReaction: "tilt",
    contextMenuBlink: true,
    expressionTriggers: {
      cheeky: "roll",
      surprised: "recoil",
      sleepy: "droop",
    },
  }}
  blink={{ enabled: true, interval: [2600, 6200], duration: 150 }}
  auto={{ enabled: false, expressions: ["neutral", "thinking"] }}
  eyeScale={1}
  eyeDistance={1}
  gazeLimit={1}
  clickAction="react"
/>
```

See the [package README](packages/moodie/README.md) for the complete API and custom-expression examples.

## Status

Moodie is at `0.5.1`. The public API is typed and tested, but minor releases may refine names before `1.0`.

The full source is available on the default branch, and installable package archives are attached to [GitHub Releases](https://github.com/arhxam/moodie-react/releases).

## License

MIT © Moodie contributors.
