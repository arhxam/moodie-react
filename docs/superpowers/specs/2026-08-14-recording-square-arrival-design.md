# Recording Square Arrival Design

**Date:** 2026-08-14

## Goal

Tune the landing-page playground for one reliable recording sequence: begin with the core circular face, demonstrate cursor tracking and a normal blink, convert directly to a square, then show the square settle into place with smaller fitted eyes and a convincing rightward roll/tremble.

## Scope

This is website choreography, not a new `@moodie/react` API. The reusable component keeps its existing pointer, blink, shape, and eye-motion contracts. The playground composes those contracts into the recording performance.

## Interaction Sequence

1. The page opens on the acid-lime circular face and gives the recorder a longer stable lead-in before any existing automatic showcase progression.
2. Moving anywhere over the canvas retains the existing parent-surface cursor tracking.
3. A single right-click retains the existing natural blink.
4. The first double-right-click body conversion goes directly from circle to square. Choosing square from the inspector triggers the same result.
5. Square arrival atomically reduces eye scale and spacing so the eyes fit the straighter silhouette.
6. A wrapper animation shifts and rolls the face to the right, then resolves through a short damped tremble. A restrained eye squint reinforces the landing without taking over the shot.
7. The automatic showcase director closes when square arrives, leaving the recorder free to change expressions and eye performances manually without a timer replacing the square.

## Motion Design

The performance is two layers that begin together:

- **Core morph:** Moodie's existing topology-safe spring morph changes circle to square while eye scale moves to `0.82` and eye distance to `0.9`.
- **Stage performance:** a keyed wrapper uses a roughly 1.2-second corner-weighted transform. It first translates right with a positive rotation, rebounds slightly left, then finishes near its original center through decreasing alternating rotations.

The wrapper keeps the eyes and body synchronized because it transforms the complete SVG rather than either eye independently. `prefers-reduced-motion` disables the wrapper transform; the final square and fitted-eye state still applies immediately.

## Architecture

- `apps/demo/src/lib/recording-demo.ts` owns the demo shape order, square eye-fit constants, and a pure config transformation. Keeping this data pure makes the recording contract easy to test.
- `Playground` routes both gesture-driven and inspector-driven shape changes through one handler. When the target is square it applies the pure transformation, closes the director, increments a performance key, and triggers the restrained eye cue.
- `.demo-face-frame--square-arrival` in the existing global stylesheet owns the website-only roll/tremble keyframes.
- The opening showcase step receives a longer recording hold, while pointer entry pauses long enough to complete the cursor and blink portion comfortably.

## Verification

- Pure tests prove the first body conversion is circle to square, square eye geometry is fitted, and unrelated settings are preserved.
- Playground tests prove the existing double-right-click gesture reaches square, closes autoplay, and exposes the square-arrival state.
- Reduced-motion CSS is checked statically and in the production build.
- Browser QA records the full desktop path, confirms gaze movement and normal right-click blink, verifies finite SVG paths throughout square arrival, confirms the director remains closed, checks mobile layout, and checks the app console.
