# Moodie design specification

## Product

Moodie is an open-source React component for adding a small expressive face to loading states, empty states, assistants, onboarding flows, and playful interface moments. Its core promise is that a single SVG-based component can feel alive without canvas, image assets, or an animation timeline.

The repository ships two independently useful surfaces:

1. `@moodie/react`, the framework-facing component package.
2. `apps/demo`, a shadcn-based website that documents and demonstrates every important capability.

## Visual direction

The design uses true white, true black, neutral gray borders, and a single user-configurable accent. It is editorial and open rather than dashboard-like: large type, broad whitespace, hairline rules, and one strong studio frame. The playground is the hero product surface.

The accepted concept is `/Users/ab/.codex/generated_images/019ff7ec-5fc0-7180-8ec6-07aea71538f3/exec-2bbc4bb7-6acc-4a62-a07b-0c3c207aa56a.png`.

Design tokens:

- Background: `#ffffff`
- Foreground: `#0a0a0a`
- Muted foreground: `#6b6b6b`
- Border: `#dedede`
- Muted surface: `#f6f6f6`
- Default accent/body: `#5b6cff`
- Default eye: `#0a0a0a`
- Radius: 10px controls, 16px studio frame
- Typography: Geist-style neo-grotesk, tight display tracking, compact UI labels
- Motion: spring-based morphs, 140–700 ms depending on action, no decorative looping movement outside the face

## Component architecture

### Geometry engine

All body and eye shapes are generated from normalized points and converted to closed cubic SVG paths. Every preset produces the same number of path commands, allowing animation between expressions and body shapes without crossfades or image swaps.

An expression contains independent left and right eye geometry: center offset, width, height, rotation, curvature, and optional asymmetry. A body preset contains aspect, corner/superellipse strength, rotation, and irregularity. Custom expressions and shapes use the same normalized contract.

### Animation engine

The React component delegates interpolation to Motion springs. It combines four independent layers:

- expression morphing;
- gaze/pointer offsets;
- blink compression;
- whole-face reactions such as bounce, tilt, squash, and turn.

The package supports controlled and uncontrolled expressions. Automatic expression cycling and blinking use cadence ranges, clean up timers, and pause while the document is hidden. `prefers-reduced-motion` disables autonomous animation and converts user-triggered changes to short non-spring transitions.

### Public API

The primary component is `Moodie`. Configuration groups are nested to stay readable:

- visual: `size`, `color`, `eyeColor`, `shape`, `className`, `style`, `ariaLabel`;
- expression: `expression`, `defaultExpression`, `expressions`, `onExpressionChange`;
- motion: `motion`, `spring`, `transition`, `reducedMotion`;
- behavior: `blink`, `gaze`, `pointer`, `auto`, `reaction`;
- composition: `renderBody`, `renderEye`, and normalized custom definitions.

Convenience exports include presets, types, `createExpression`, `createShape`, `useMoodieControls`, and `MoodieProvider` for shared defaults.

The component forwards a ref exposing `blink()`, `react()`, `setExpression()`, and `lookAt()` imperative methods for event-driven product integrations.

## Demo information architecture

1. Minimal sticky navigation with anchors and GitHub/install actions.
2. Hero with the product promise and direct playground/docs actions.
3. Playground studio:
   - large interactive face canvas;
   - clickable preset rail;
   - randomize action that visibly morphs the face;
   - shadcn inspector for expression, body shape, colors, spring, gaze, blink, pointer tracking, and size;
   - live JSX and JSON output with copy actions.
4. Preset gallery where every face is a real component instance.
5. Feature rail focused on bundle characteristics, configuration, motion, drop-in usage, and license.
6. API table and LLM guide callout.
7. Minimal footer with package install command and repository link.

Mobile collapses the studio into face, presets, inspector, and code in that order. Controls retain 44px touch targets, the canvas remains square, and code scrolls horizontally.

## Accessibility

- The SVG has an accessible label and remains decorative only when `aria-hidden` is explicitly requested.
- Preset controls expose selected state and descriptive labels.
- Pointer tracking is supplemental; all reactions have keyboard/button equivalents.
- Autonomous motion respects reduced-motion preferences.
- Color values remain fully user-controlled, while the demo defaults pass contrast checks.
- Focus styles use shadcn semantic ring tokens.

## Errors and edge cases

- Invalid numeric inputs are clamped to documented safe ranges.
- Unknown preset names fall back to `neutral` and issue a development-only warning.
- Empty custom expression sets do not break the built-in presets.
- Server rendering avoids browser globals during render.
- Timers and animation frames are removed on unmount.
- Zero-sized containers still render a valid viewBox and recover when resized by CSS.

## Testing

- Unit tests cover geometry determinism, equal path topology, clamping, preset resolution, and config normalization.
- Component tests cover rendering, controlled state, click reactions, imperative methods, reduced motion, pointer tracking, and timer cleanup.
- The demo receives a production build check plus desktop/mobile browser smoke tests.
- Browser QA verifies randomize, preset selection, color changes, switches, code synchronization, copy feedback, responsive layout, console health, and reduced-motion behavior.

## Open-source deliverables

- MIT license
- contribution guide, code of conduct, changelog, and security policy
- package README and root README
- `llms.txt` plus `docs/llm-guide.md` with copy-paste prompts and API context
- typed exports, source maps, ESM build, and tree-shakeable package metadata
- GitHub Actions for test/build and Dependabot configuration

## Self-review

The package and demo are independent boundaries, configuration is explicit, SSR and reduced motion are covered, no reference implementation data is reused, and every requested deliverable has a verification path. No placeholders or unresolved product decisions remain.
