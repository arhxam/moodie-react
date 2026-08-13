# Reference shape expansion

## Goal

Add the six body silhouettes shown in the supplied reference to Moodie's public shape API and interactive demo without removing or changing the existing five shapes.

The new public names are `oval`, `triangle`, `cloud`, `hexagon`, `square`, and `drop`. They correspond, in order, to the green oval, purple rounded triangle, white cloud, green softened hexagon, orange rounded square, and orange teardrop in the reference.

## Geometry

Each silhouette is a code-native SVG path in the existing normalized `0 0 200 200` coordinate system. Every path uses exactly 16 cubic segments, matching the existing body topology so Motion can interpolate between every old and new shape without a crossfade or asset swap.

The silhouette rules are:

- `oval`: broad, gently asymmetric oval with a subtly flatter lower edge.
- `triangle`: three clearly readable corners with generous rounding and a stable horizontal base.
- `cloud`: three upper lobes, two side lobes, and a softly scalloped lower edge.
- `hexagon`: six softened corners, a short upper edge, and a centered lower point pair.
- `square`: near-square body with broad continuous corner radii and slight organic asymmetry.
- `drop`: narrow rounded tip, full lower body, and softly flattened lower curve.

All paths remain centered, stay safely inside the view box, and preserve enough interior area for the existing eye projection system.

## Public API and demo

`ShapeName` expands additively. A single exported `SHAPE_NAMES` tuple becomes the source of truth for validation, tests, and consumer discovery. Existing unknown-shape fallback behavior remains `circle`.

The demo's body-shape selector includes the six new values. Selecting one updates the live Moodie instance and the generated JSX/JSON through the existing state flow; no new UI pattern is introduced.

The README, package README, LLM guide, and public `llms.txt` lists are updated so documented API values match runtime behavior.

## Errors and compatibility

- Existing shape names and rendering remain unchanged.
- Unknown runtime strings continue to fall back to `circle`.
- The package remains asset-free and SSR-safe.
- Shape changes continue using the user's selected motion preset and reduced-motion preference.

## Testing and verification

- Geometry tests assert all 11 built-ins are distinct and use 16 cubic segments.
- Bounds tests cover every built-in and assert safe centering within the view box.
- A component/public-API test confirms each new name reaches the rendered `data-shape` attribute.
- Demo tests confirm the selector inventory includes the six new values and generated code preserves a selected new shape.
- Typecheck, unit tests, production build, and a browser interaction pass must succeed.
- A browser screenshot containing all six rendered shapes is compared directly with the supplied reference for silhouette, eye placement, ordering, and relative proportions.

## Self-review

The scope is additive and limited to body silhouettes, API discoverability, demo selection, documentation, and verification. There are no placeholders, conflicting names, asset dependencies, or changes to expressions, eye geometry, surface projection, or unrelated page layout.
