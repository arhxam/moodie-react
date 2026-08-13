# Changelog

## Unreleased

## 0.5.1 — 2026-08-14

- Tuned the landing playground for a stable recording sequence with a longer circular-face lead-in and extended cursor-control pause.
- Made the first double-right-click body conversion land directly on square while preserving the normal single-right-click blink.
- Added a demo-only fitted-eye square arrival that rolls right and settles through a damped tremble before handing control to manual mode.

## 0.5.0 — 2026-08-13

- Added an authored playground showcase that continuously demonstrates gaze, expressions, body forms, eye scale and spacing, vivid palettes, and secondary eye performances without requiring hover.
- Made pointer entry and manual controls temporarily pause the showcase, while face clicks keep their reaction and restart the quiet period.
- Added a visible Close demo handoff that permanently stops choreography for the current session and leaves the complete configurator in manual control.
- Changed the package and playground default palette to high-contrast acid lime and deep ink.
- Added smooth body and eye fill interpolation, reduced-motion-safe autoplay suppression, deterministic lifecycle cleanup, and regression coverage for pause/resume/close behavior.

## 0.4.0 — 2026-08-13

- Added seven secondary eye performances: roll, vanish, orbit, double-take, recoil, droop, and shake.
- Made every eye cue interruptible from the currently rendered pose with stale-completion protection and guaranteed neutral/full-opacity settling.
- Added configurable expression-to-cue triggers with expressive defaults and per-expression `none` suppression.
- Added a compact live performance launcher plus synchronized React and JSON output to the playground.
- Expanded the body catalog to eleven shapes and added opt-in double-right-click shape cycling.
- Documented the complete motion catalog, typed constants, imperative triggers, idle-safety guidance, and LLM integration contract.

## 0.3.2 — 2026-08-13

- Synchronized left/right cursor tracking by restricting `expressionMotion.stagger` to expression-change choreography.
- Changed edge foreshortening from whole-eye scaling to local compression of only the outward-facing contour shoulder.
- Preserved the inward contour and localized volume compensation so rapid edge and corner poses stay stable.
- Removed undefined SVG path interpolation during initial render for clean first-frame animation and browser consoles.

## 0.3.1 — 2026-08-13

- Softened compounded edge deformation so eyes retain an attractive capsule shape at strong horizontal, vertical, and diagonal gaze.
- Added bounded tangential volume preservation with a configurable `surface.volumePreservation` control.
- Replaced dominant-axis edge detection with a continuous directional envelope for smoother diagonal travel.
- Increased eye/body damping and shortened the default eye stagger for cleaner rapid reversals and more natural settling.
- Added the volume control to the playground, generated React/JSON, runtime diagnostics, package documentation, and LLM guide.

## 0.3.0 — 2026-08-13

- Added curved-surface eye projection with radial edge compression, near/far depth scaling, directional turn, and silhouette clipping.
- Added configurable body follow, separate eye/body inertia, perspective strength, edge compression, depth, and maximum turn.
- Upgraded expression changes to a five-stage anticipation, arrival, overshoot, and settle performance with configurable eye staggering.
- Added synchronized surface-realism and expression-performance controls to the playground, React output, JSON output, public API, and LLM guide.
- Hardened extreme-gaze geometry so rapid cursor reversals remain finite, bounded, topology-compatible, and free of visible deformation.

## 0.2.0 — 2026-08-13

- Added smooth notice, glance, squint, wide, and flutter eye micro-performances.
- Added configurable parent-canvas tracking so gaze begins as soon as the cursor enters a preview surface.
- Added realistic hover eye/body recognition cues without changing the active expression.
- Added configurable right-click blinking with context-menu suppression on the tracking surface.
- Added idle eye choreography, imperative `animateEyes`, reduced-motion handling, demo controls, and synchronized React/JSON output.

- Added stronger cursor tracking with configurable sensitivity, horizontal and vertical travel, and directional tilt.
- Prepared direct GitHub Release installation and canonical public repository metadata.
- Added automatic expression performances with semantic eye choreography and configurable intensity, duration, eye, and body layers.
- Made reaction animations safe under rapid interruption and kept energetic bounce motion volume-preserving.
- Recentered organic body geometry and corrected responsive SVG sizing in the demo.
- Added full expression-performance controls and synchronized React/JSON output to the playground.

## 0.1.0 — 2026-08-13

- Initial React component with 16 expression presets and five body shapes.
- Spring-based SVG morphs, gaze, blink, auto-expression, click reactions, and imperative controls.
- Provider defaults, controlled-state hook, custom expressions, and reduced-motion support.
- Interactive shadcn demo, API overview, and LLM integration guide.
