# Smooth projection polish design

## Problem

The v0.3.0 surface model produces the intended directional compression and depth, but the live demo reveals three visual problems at strong gaze values:

1. yaw shrink, radial compression, and depth scaling compound, making asymmetric eyes look too narrow at horizontal edges;
2. the edge envelope is driven by the maximum axis, so diagonal direction changes can feel mechanical instead of continuous;
3. eye and body springs retain enough independent overshoot that rapid reversals can read as wobble rather than soft follow-through.

The UI and public interaction model are already correct. This pass changes only the motion geometry, defaults, configuration output, documentation, and tests required to make the existing component more attractive and smooth.

## Considered approaches

### Constants-only retuning

Lower edge compression and turn defaults. This is low risk, but it leaves the compounded geometry and directional discontinuity in place. It improves the default while custom high-intensity configurations still deform poorly.

### Refined SVG projection — selected

Keep topology-compatible SVG paths and the existing React API. Use a smooth directional magnitude, bounded volume preservation, softer near/far depth, and more heavily damped eye/body transitions. This fixes the underlying behavior without adding dependencies or changing rendering technology.

### Canvas or WebGL projection

Render the face on a true 3D surface. This could provide physical depth, but it would increase package size, accessibility complexity, integration cost, and implementation risk for a two-eye component.

## Geometry design

The projection engine will replace the maximum-axis edge signal with a smooth superellipse magnitude. Horizontal and vertical edges still reach full intensity, while diagonal changes remain differentiable and do not snap between dominant axes.

Radial compression will be softened so the eye remains a capsule rather than collapsing into a stick. A new `volumePreservation` configuration value will apply a small, bounded scale on the tangential axis as the radial axis compresses. The compensation is deliberately subtle: it preserves visual weight without making the eye balloon.

Yaw-related width shrink and near/far depth scaling will remain, but their factors will be reduced so the three effects no longer multiply into excessive narrowing. All generated points remain finite, inside the 200 × 200 view box, clipped to the body silhouette, and topology-compatible.

## Motion design

Eye geometry remains the leading layer and the body remains the following layer. The default eye spring will receive slightly more damping and slightly less mass so it arrives quickly without a visible rebound. The body spring will be slower and near critically damped so it follows once and settles once.

The default expression eye stagger will be shortened enough to feel organic rather than delayed. Expression anticipation and overshoot remain available and are not weakened.

Reduced-motion behavior remains unchanged: geometry updates immediately and automatic performances remain suppressed.

## Configuration

Add `surface.volumePreservation` with a normalized `0–1` range and a conservative default. It is exposed through:

- `SurfaceConfig`, normalization, and runtime data attributes;
- the existing independently scrollable shadcn configuration panel;
- generated React and JSON output;
- package README, repository README, LLM guide, and `llms.txt`.

Existing `surface` configurations remain source-compatible because the new field is optional at the component boundary and filled by normalization.

## Testing and acceptance

Automated tests must prove:

- full-edge compression stays strong but no longer drops below the attractive capsule threshold;
- tangential volume compensation is bounded and configurable;
- diagonal direction changes remain continuous;
- extreme input stays finite, bounded, and topology-compatible;
- the component and demo expose the new configuration and runtime value;
- reduced motion remains immediate.

Browser QA must cover desktop and mobile production-like viewports, center-to-edge movement, diagonals, rapid reversals, expression switching, the configuration control, console health, and screenshots before and after the change.

## Scope boundary

This pass does not redesign the site, replace the SVG renderer, add decorative effects, or change expression definitions. It refines how existing geometry moves and settles.
