# Playground Showcase Director Design

**Date:** 2026-08-13

## Goal

Make the demo explain Moodie's range without requiring the visitor to discover controls first. The face should feel alive on an idle canvas, yield naturally to direct interaction, and expose the existing configurator unchanged when the visitor closes the guided demo.

## Experience

The playground opens in **Demo running** mode. A deterministic director advances through a curated loop of expressions, shapes, high-contrast palettes, gaze positions, eye scale and spacing, and secondary eye performances. It is intentionally authored rather than random so every loop is smooth, visually balanced, and dependable for screen recording.

Pointer entry temporarily gives gaze control to the visitor. Clicking the face keeps the existing click reaction and pauses the director for several seconds, so the selected reaction is readable before choreography resumes. Using any manual control has the same temporary-pause behavior.

A compact **Close demo** button lives in the preview header. Closing is permanent for the current page session: timers stop, scripted gaze is released, the current visual state remains in the form, and the full right-hand configuration dashboard continues to work as manual mode. Reloading starts the showcase again.

## Visual Direction

The default blue-and-black face is replaced with an acid-lime body and deep-ink eyes. The loop moves through a vivid but controlled palette: acid lime, coral, butter yellow, lavender, mint, hot pink, tangerine, and cyan. Every pair retains strong foreground/background contrast.

The studio layout and control hierarchy remain unchanged. New UI is limited to the preview-header status and close control. State changes use existing Moodie geometry transitions; core fill animation is extended so palette changes interpolate rather than snap.

## Architecture

### Curated sequence

`apps/demo/src/lib/showcase.ts` owns immutable showcase steps and pure helpers. Each step contains only the fields the director may change:

- expression and shape
- body and eye colors
- normalized gaze target
- eye scale and distance
- secondary eye performance
- hold duration

Applying a step preserves all other user configuration. A wrapping index helper keeps sequencing explicit and independently testable.

### Lifecycle hook

`useShowcaseDirector` owns one step timer and one pause/resume timer. Its public state is `running`, `paused`, or `closed`.

- `running`: advances after the current step's hold duration
- `paused`: clears advancement and resumes after the requested quiet period
- `closed`: clears every timer and cannot restart during the current mount

Repeated interactions replace the existing resume timeout instead of stacking timers. Cleanup on unmount prevents stale state updates. Reduced-motion preference starts the director paused and suppresses automatic choreography.

### Playground integration

The current step updates `config` directly so automatic changes do not recursively count as manual edits. The step's performance is triggered through the existing imperative Moodie handle after the visual state update.

The controlled `gaze` prop is supplied only while the director is running and the pointer is outside the stage. On pointer entry, the scripted gaze is removed before the face's existing parent-target tracking takes over. Clicks, presets, randomization, performance buttons, and inspector edits all pause the director.

## Accessibility and Safety

- Status is textual, not color-only, and announced politely.
- The close control is a real button with an explicit accessible name.
- `prefers-reduced-motion` prevents autoplay.
- Gaze values and visual scale/spacing values stay within public API bounds.
- Color pairs meet accessible contrast targets.
- All timers are deterministic, replaceable, and cleaned up.

## Verification

Pure tests cover sequence bounds, wrapping, field preservation, palette contrast, and initial-state agreement. Hook tests use fake timers to prove advancement, interaction pause, pause extension, permanent close, reduced-motion behavior, and cleanup. Existing package/demo suites, typecheck, build, and lint must remain green. Browser QA will verify desktop and mobile layout, pointer takeover, click pause, manual edits, close behavior, console output, and production behavior.
