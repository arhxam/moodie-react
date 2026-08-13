import { Moodie } from "@moodie/react";
import { MousePointer2Icon, ShuffleIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DISPLAY_EXPRESSIONS,
  INITIAL_CONFIG,
  type PlaygroundConfig,
} from "@/lib/playground";

import { CodeOutput } from "./code-output";
import { ConfigInspector } from "./config-inspector";
import { PresetRail } from "./preset-rail";

export function Playground() {
  const [config, setConfig] = useState<PlaygroundConfig>(INITIAL_CONFIG);

  const update = useCallback(
    <Key extends keyof PlaygroundConfig>(
      key: Key,
      value: PlaygroundConfig[Key],
    ) => setConfig((current) => ({ ...current, [key]: value })),
    [],
  );

  const randomize = useCallback(() => {
    setConfig((current) => {
      const candidates = DISPLAY_EXPRESSIONS.filter(
        (expression) => expression !== current.expression,
      );
      return {
        ...current,
        expression: candidates[Math.floor(Math.random() * candidates.length)],
      };
    });
  }, []);

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
            <span className="preview-state">
              <i style={{ background: config.color }} />
              {config.expression}
            </span>
          </div>
          <div className="face-stage">
            <Moodie
              expression={config.expression}
              onExpressionChange={(expression) =>
                update("expression", expression)
              }
              expressionOrder={DISPLAY_EXPRESSIONS}
              shape={config.shape}
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
              }}
              blink={config.blink}
              auto={
                config.auto
                  ? { enabled: true, expressions: DISPLAY_EXPRESSIONS }
                  : false
              }
              eyeScale={config.eyeScale}
              eyeDistance={config.eyeDistance}
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
              ariaLabel={`Animated ${config.expression} face. Enter the canvas to track, click to randomize, or right-click to blink.`}
            />
          </div>
          <div className="stage-actions">
            <div className="stage-hint">
              <MousePointer2Icon /> Enter to track · hover to react ·
              right-click to blink
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
            reset={() => setConfig(INITIAL_CONFIG)}
          />
          <CodeOutput config={config} />
        </div>
      </div>
    </section>
  );
}
