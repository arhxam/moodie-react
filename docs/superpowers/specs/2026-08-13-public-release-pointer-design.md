# Public Release and Pointer Performance Design

## Outcome

Moodie will be publicly accessible from `github.com/arhxam/moodie-react`, with the complete source on the default `master` branch and the live demo linked as the repository homepage. The production playground will demonstrate stronger cursor tracking and generate configuration that consumers can copy directly.

## Pointer API

`PointerConfig` will remain backward compatible and add three optional controls after normalization:

- `strength`: cursor sensitivity, default `1.35`, range `0–3`.
- `rangeX`: maximum horizontal eye travel in view-box units, default `18`, range `0–30`.
- `rangeY`: maximum vertical eye travel, default `12`, range `0–24`.
- `tilt`: directional lean in degrees, default `3`, range `0–10`.

The eyes will travel using `rangeX` and `rangeY`, while a nested pointer-performance group adds a small opposing rotation and translation. The existing `gazeLimit` remains a global range multiplier. Pointer motion uses the selected motion preset and respects `pointer={false}`, controlled gaze, and reduced-motion settings.

## Playground

The demo defaults to visibly stronger tracking and exposes cursor sensitivity, horizontal travel, vertical travel, tilt, and gaze range. Generated React and JSON include the complete pointer object so the behavior is clearly portable.

## Public Repository

Before the repository rename, all source links and package metadata will change from `arhxam/custom-icon` to `arhxam/moodie-react`. After checks pass, the repository will be renamed, its description/homepage/topics updated, visibility changed to public, and the feature PR merged into `master`. Vercel will be reconnected or verified against the renamed repository and production redeployed from the final default branch.

## Verification

Tests cover pointer normalization, generated configuration, disabled tracking, and pointer movement attributes. Browser QA measures the rendered eye transform near opposing cursor edges, exercises the controls and generated code, and checks desktop/mobile framing and console health. GitHub is verified anonymously through its public API and the default branch tree is checked for package source files.
