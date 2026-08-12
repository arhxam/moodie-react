# Moodie

Give your interface a little life.

Moodie is a small, deeply configurable animated face for React. It renders topology-compatible SVG paths and animates them with spring physics, so expression changes feel fluid without canvas, image assets, or a timeline editor.

**[Open the live playground](https://moodie-react.vercel.app)** · **[Read the LLM guide](docs/llm-guide.md)**

```bash
npm install @moodie/react motion
```

```tsx
import { Moodie } from "@moodie/react";

export function LoadingState() {
  return (
    <Moodie
      expression="curious"
      color="#5b6cff"
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
- Five body shapes and fully configurable CSS colors
- Pointer-following gaze, automatic blinking, and expression cycling
- Spring, gentle, snappy, bouncy, tween, and no-motion modes
- Controlled or uncontrolled React state
- Custom expressions built from normalized eye geometry
- Imperative `blink`, `lookAt`, `react`, and `setExpression` methods
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
  pointer={{ enabled: true, strength: 1 }}
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

Moodie is at `0.1.0`. The public API is typed and tested, but minor releases may refine names before `1.0`.

## License

MIT © Moodie contributors.
