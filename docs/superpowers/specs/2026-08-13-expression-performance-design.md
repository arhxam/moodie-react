# Moodie Expression Performance Design

## Problem

Expression changes currently read as path swaps. The body reaction is only played for an explicit `react()` call, the eyes do not perform a transitional gesture, and the organic `blob` path can appear off-center because each axis receives a reciprocal radial distortion.

## Design

Moodie will treat an expression change as a short performance with three coordinated layers:

1. Keep every body path centered around `(100, 100)` and use a shared radial perturbation for organic shapes so the silhouette retains volume without lopsided bulges.
2. Add optional performance metadata to expression definitions. Each preset can specify a directional eye accent, eye rotation, and eye-scale accent appropriate to its meaning.
3. Automatically play the preset's existing body reaction and its eye accent whenever the expression changes. The motion will overshoot briefly and settle, making the state change readable in recordings while preserving pointer gaze, blinking, reduced-motion behavior, and explicit imperative reactions.

## Public API

Add `expressionMotion?: boolean | Partial<ExpressionMotionConfig>` with:

- `enabled`: enable automatic expression performances.
- `intensity`: scale gesture amplitude from `0` to `2`.
- `duration`: performance duration from `180` to `1200` milliseconds.
- `eyes`: enable expression-specific eye accents.
- `body`: enable the body reaction.

Custom expressions can supply an optional `performance` object with `x`, `y`, `rotate`, `scaleX`, and `scaleY` targets. Existing consumers remain source-compatible. `motion="none"`, `expressionMotion={false}`, and reduced motion suppress automatic performances.

## Demo and Documentation

The playground exposes an Expressiveness slider, enables a stronger default, and includes it in generated React and JSON configuration. The package README and LLM guide document the new option.

## Verification

Geometry tests assert centered, bounded shapes. Configuration and rendering tests cover normalization, automatic cue structure, opt-out behavior, and public exports. Browser QA will exercise repeated preset changes at desktop and mobile sizes and inspect screenshots and console output.
