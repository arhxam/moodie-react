# Moodie implementation plan

## Repository map

- `packages/moodie/src/geometry.ts`: normalized path generation and validation.
- `packages/moodie/src/presets.ts`: original built-in expression and body definitions.
- `packages/moodie/src/config.ts`: defaults, clamps, and public option normalization.
- `packages/moodie/src/moodie.tsx`: animated SVG component and imperative API.
- `packages/moodie/src/provider.tsx`: shared defaults context.
- `packages/moodie/src/use-moodie-controls.ts`: controlled/uncontrolled helper.
- `packages/moodie/src/index.ts`: public exports only.
- `packages/moodie/test/*`: geometry, config, and component behavior tests.
- `apps/demo/src/components/ui/*`: shadcn source components.
- `apps/demo/src/components/playground/*`: canvas, preset rail, inspector, and code output.
- `apps/demo/src/components/sections/*`: hero, gallery, API, guide, and footer.
- `apps/demo/src/App.tsx`: page composition.
- `apps/demo/src/index.css`: shadcn tokens and the shared black/white visual system.
- `docs/llm-guide.md` and `apps/demo/public/llms.txt`: LLM-facing integration context.

## Task sequence

1. Scaffold npm workspaces, TypeScript, Vitest, Vite, Tailwind, and package builds.
2. Initialize shadcn for the demo and add only the controls used by the inspector.
3. Write failing geometry/config tests; implement topology-stable path generation and normalization; rerun green.
4. Write failing component tests; implement the SVG, springs, pointer gaze, blink, automatic expressions, reduced motion, provider, and imperative ref; rerun green.
5. Implement the complete demo against the accepted concept, using real component instances for every preview.
6. Add live configuration state, animated randomization, preset selection, color editing, motion controls, synchronized JSX/JSON output, and copy feedback.
7. Add README, API tables, examples, LLM guide, license, contribution/security/community files, and CI.
8. Run formatting, typecheck, tests, package build, and demo build.
9. Run browser QA at desktop and mobile sizes, compare screenshots with the concept, repair mismatches, and repeat until clean.
10. Commit and push the branch, create the GitHub pull request against `master`, deploy the demo to Vercel, and verify the live URL.

## Verification commands

```bash
npm run format:check
npm run typecheck
npm test
npm run build
npm run dev --workspace apps/demo -- --host 127.0.0.1
```

Browser flow: `/` → click **Randomize mood** → face morphs and selected preset/code update → change body color → face and JSX update → disable pointer tracking → state persists → switch to a named preset → selected state updates.
