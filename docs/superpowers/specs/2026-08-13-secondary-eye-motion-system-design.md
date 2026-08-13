# Secondary Eye Motion System

## Goal

Make Moodie's transient eye performances feel as polished as its gaze and expression motion. Add visually distinct secondary cues that can be triggered from code and demonstrated in the playground without changing the site's overall layout.

## Architecture

Secondary cues remain a transform layer above gaze-projected eye paths and below no application state. Gaze continues updating both paths in lockstep while a cue translates, rotates, scales, or fades the shared eye-performance group. Expression geometry and body reactions remain separate layers, so a cue can combine with an expression without rewriting it.

The existing `EyeAnimationName`, `createEyeAnimationCue`, `eyeMotion` configuration, and `animateEyes` handle are extended rather than replaced. This keeps current integrations source-compatible.

## Cue Catalog

- `notice`, `glance`, `squint`, `wide`, and `flutter` remain available.
- `roll` sweeps upward and around before settling.
- `vanish` compresses and fades to true zero opacity, holds briefly, then returns with a restrained overshoot.
- `orbit` traces a compact circular path for a dizzy or searching response.
- `doubleTake` snaps away, pauses, then returns past center and settles.
- `recoil` pulls backward and narrows before recovering.
- `droop` lowers and softens the eyes before lifting them back to rest.
- `shake` performs a small decaying lateral refusal.

All tracks have matched keyframe lengths and monotonic timing arrays. Movement and scale are bounded after intensity is applied. Each cue ends at the neutral transform and full opacity.

## Interruption and Scheduling

A new cue cancels the active cue and begins from the currently rendered values rather than forcing the group to neutral first. The active cue timer is replaced atomically, and only the latest cue may clear the public active state. Disabling eye motion or reduced-motion mode stops the cue and restores neutral values.

Idle cues remain opt-in through `idleAnimations`; disruptive cues such as `vanish` are not added to the default idle pool. Expression triggers use a normalized `expressionTriggers` map. Defaults are expressive but restrained: `cheeky → roll`, `dizzy → orbit`, `surprised → recoil`, `sleepy → droop`, and `alert → doubleTake`. Consumers may override a mapping with any cue or `none`.

## Public API

- Extend `EyeAnimationName` with the seven cues.
- Extend `EyeMotionConfig` with `expressionTriggers`.
- Preserve `ref.current.animateEyes(name)` as the explicit trigger.
- Preserve `hover` and `idleAnimations` as configurable trigger sources.
- Expose active cue state through the existing `data-eye-animation` attribute.

## Demo

Add a compact secondary-motion selector and Play button inside the existing independently scrollable configuration panel. The control updates demo-only state and calls the component handle; it does not add irrelevant props to generated code. The existing code output includes `expressionTriggers` so the automatic trigger policy is directly reusable.

## Safety and Verification

- Unit tests cover every cue's topology, timing, bounds, neutral settle, and opacity.
- Configuration tests cover invalid names, duplicate idle cues, and expression trigger overrides.
- Component tests cover imperative triggering, expression triggering, interruption cleanup, and reduced motion.
- Demo tests cover generated React and JSON configuration.
- Browser QA exercises every cue, rapid cue replacement, expression changes, cursor movement during cues, right-click blink, console health, and desktop/mobile rendering.

## Non-goals

This pass does not add audio, particle effects, body-shape changes, a general timeline editor, or per-eye independent choreography. Those would expand the component contract beyond the transient eye-motion problem.
