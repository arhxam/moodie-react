import {
  Moodie,
  type EyeAnimationName,
  type MoodieHandle,
} from "@moodie/react";
import { MousePointer2Icon, ShuffleIcon, XIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DISPLAY_EXPRESSIONS,
  EXPRESSION_EYE_TRIGGERS,
  INITIAL_CONFIG,
  type PlaygroundConfig,
} from "@/lib/playground";
import {
  RECORDING_SHAPE_ORDER,
  applyRecordingShape,
} from "@/lib/recording-demo";
import {
  SHOWCASE_PAUSE_MS,
  SHOWCASE_STEPS,
  applyShowcaseStep,
} from "@/lib/showcase";

import { CodeOutput } from "./code-output";
import { ConfigInspector } from "./config-inspector";
import { PresetRail } from "./preset-rail";
import { useShowcaseDirector } from "./use-showcase-director";

const SHOWCASE_HOLDS = SHOWCASE_STEPS.map((step) => step.hold);

export function Playground() {
  const [config, setConfig] = useState<PlaygroundConfig>(INITIAL_CONFIG);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [previewEyeAnimation, setPreviewEyeAnimation] =
    useState<EyeAnimationName>("roll");
  const moodieRef = useRef<MoodieHandle>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const director = useShowcaseDirector({
    holds: SHOWCASE_HOLDS,
    enabled: !prefersReducedMotion,
  });
  const showcaseStep = SHOWCASE_STEPS[director.index];

  useEffect(() => {
    setConfig((current) => applyShowcaseStep(current, showcaseStep));
    moodieRef.current?.animateEyes(showcaseStep.cue);
  }, [showcaseStep]);

  const update = useCallback(
    <Key extends keyof PlaygroundConfig>(
      key: Key,
      value: PlaygroundConfig[Key],
    ) => {
      if (key === "shape" && value === "square") {
        director.close();
        setConfig((current) => applyRecordingShape(current, "square"));
        requestAnimationFrame(() => moodieRef.current?.animateEyes("squint"));
        return;
      }

      director.pauseFor(SHOWCASE_PAUSE_MS);
      setConfig((current) =>
        key === "shape"
          ? applyRecordingShape(current, value as PlaygroundConfig["shape"])
          : { ...current, [key]: value },
      );
    },
    [director],
  );

  const randomize = useCallback(() => {
    director.pauseFor(SHOWCASE_PAUSE_MS);
    setConfig((current) => {
      const candidates = DISPLAY_EXPRESSIONS.filter(
        (expression) => expression !== current.expression,
      );
      return {
        ...current,
        expression: candidates[Math.floor(Math.random() * candidates.length)],
      };
    });
  }, [director]);

  const playPreviewEyeAnimation = useCallback(() => {
    director.pauseFor(SHOWCASE_PAUSE_MS);
    moodieRef.current?.animateEyes(previewEyeAnimation);
  }, [director, previewEyeAnimation]);

  const reset = useCallback(() => {
    director.pauseFor(SHOWCASE_PAUSE_MS);
    setConfig(INITIAL_CONFIG);
  }, [director]);

  const selectPreviewEyeAnimation = useCallback(
    (animation: EyeAnimationName) => {
      director.pauseFor(SHOWCASE_PAUSE_MS);
      setPreviewEyeAnimation(animation);
    },
    [director],
  );

  const handlePointerEnter = useCallback(() => {
    setIsPointerInside(true);
    director.pauseFor(30_000);
  }, [director]);

  const handlePointerLeave = useCallback(() => {
    setIsPointerInside(false);
  }, []);

  const demoStatus =
    director.status === "closed"
      ? "Manual mode"
      : director.status === "paused"
        ? "Demo paused"
        : "Demo running";

  return (
    <section
      id="playground"
      className="playground-section page-shell"
      aria-labelledby="playground-title"
    >
      <h2 id="playground-title" className="sr-only">
        Interactive Moodie playground
      </h2>

      <div className="studio">
        <div className="studio-preview">
          <div className="preview-meta">
            <span>Live preview</span>
            <div className="preview-meta-actions">
              <Badge
                variant="outline"
                className="preview-demo-status"
                data-state={director.status}
                aria-live="polite"
              >
                <i />
                {demoStatus}
              </Badge>
              {director.status !== "closed" ? (
                <Button
                  variant="outline"
                  size="xs"
                  aria-label="Close demo"
                  onClick={director.close}
                >
                  <XIcon data-icon="inline-start" />
                  Close demo
                </Button>
              ) : null}
              <span className="preview-state" data-testid="preview-state">
                <i style={{ background: config.color }} />
                {config.expression}
              </span>
            </div>
          </div>
          <div
            className="face-stage"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <div
              className={`demo-face-frame${
                config.shape === "square"
                  ? " demo-face-frame--square-arrival"
                  : ""
              }`}
              data-recording-performance={
                config.shape === "square" ? "square-arrival" : "ready"
              }
              data-eye-scale={config.eyeScale}
              data-eye-distance={config.eyeDistance}
            >
              <Moodie
                ref={moodieRef}
                expression={config.expression}
                onExpressionChange={(expression) =>
                  update("expression", expression)
                }
                expressionOrder={DISPLAY_EXPRESSIONS}
                shape={config.shape}
                shapeOrder={RECORDING_SHAPE_ORDER}
                onShapeChange={(shape) => update("shape", shape)}
                doubleContextShapeCycle
                color={config.color}
                eyeColor={config.eyeColor}
                size={config.size}
                motion={config.motion}
                spring={{
                  stiffness: config.stiffness,
                  damping: config.damping,
                  mass: config.mass,
                }}
                pointer={{
                  enabled: config.pointer,
                  target: config.pointerTarget,
                  strength: config.pointerStrength,
                  rangeX: config.pointerRangeX,
                  rangeY: config.pointerRangeY,
                  tilt: config.pointerTilt,
                }}
                surface={{
                  enabled: config.surface,
                  perspective: config.surfacePerspective,
                  edgeCompression: config.edgeCompression,
                  depth: config.surfaceDepth,
                  bodyFollow: config.bodyFollow,
                  inertia: config.surfaceInertia,
                  maxTurn: config.maxTurn,
                  volumePreservation: config.surfaceVolumePreservation,
                }}
                eyeMotion={{
                  enabled: config.eyeMotion,
                  idle: config.idleEyeMotion,
                  hover: config.hoverEyeMotion,
                  hoverReaction: config.hoverReaction,
                  contextMenuBlink: config.contextMenuBlink,
                  intensity: config.eyeMotionIntensity,
                  interval: [
                    config.eyeMotionIntervalMin,
                    config.eyeMotionIntervalMax,
                  ],
                  expressionTriggers: EXPRESSION_EYE_TRIGGERS,
                }}
                blink={config.blink}
                auto={
                  config.auto
                    ? { enabled: true, expressions: DISPLAY_EXPRESSIONS }
                    : false
                }
                eyeScale={config.eyeScale}
                eyeDistance={config.eyeDistance}
                gaze={
                  director.status === "running" && !isPointerInside
                    ? showcaseStep.gaze
                    : undefined
                }
                gazeLimit={config.gazeLimit}
                expressionMotion={{
                  intensity: config.expressiveness,
                  duration: config.expressionDuration,
                  eyes: config.eyePerformance,
                  body: config.bodyPerformance,
                  anticipation: config.expressionAnticipation,
                  overshoot: config.expressionOvershoot,
                  stagger: config.eyeStagger,
                }}
                clickAction="random"
                onClick={() => director.pauseFor(SHOWCASE_PAUSE_MS)}
                ariaLabel={`Animated ${config.expression} face. Enter the canvas to track, click to randomize, right-click to blink, or double right-click to change shape.`}
              />
            </div>
          </div>
          <div className="stage-actions">
            <div className="stage-hint">
              <MousePointer2Icon /> Enter to track · hover to react ·
              right-click to blink · double right-click to change shape
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={randomize}>
                  <ShuffleIcon data-icon="inline-start" />
                  Try another mood
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Pick a different expression with spring morphing
              </TooltipContent>
            </Tooltip>
          </div>
          <PresetRail
            selected={config.expression}
            onSelect={(value) => update("expression", value)}
            color={config.color}
          />
        </div>
        <div className="studio-sidebar">
          <ConfigInspector
            config={config}
            update={update}
            randomize={randomize}
            reset={reset}
            previewEyeAnimation={previewEyeAnimation}
            onPreviewEyeAnimationChange={selectPreviewEyeAnimation}
            onPlayEyeAnimation={playPreviewEyeAnimation}
          />
          <CodeOutput config={config} />
        </div>
      </div>
    </section>
  );
}
