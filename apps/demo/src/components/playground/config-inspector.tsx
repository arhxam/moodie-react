import { PlayIcon, RotateCcwIcon, ShuffleIcon } from "lucide-react";
import type { EyeAnimationName } from "@moodie/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  BODY_SHAPES,
  DISPLAY_EXPRESSIONS,
  EYE_ANIMATIONS,
  EYE_PERFORMANCES,
  HOVER_REACTIONS,
  MOTION_PRESETS,
  POINTER_TARGETS,
  type PlaygroundConfig,
} from "@/lib/playground";

import { ControlRow } from "./control-row";

type InspectorProps = {
  config: PlaygroundConfig;
  update: <Key extends keyof PlaygroundConfig>(
    key: Key,
    value: PlaygroundConfig[Key],
  ) => void;
  randomize: () => void;
  reset: () => void;
  previewEyeAnimation: EyeAnimationName;
  onPreviewEyeAnimationChange: (animation: EyeAnimationName) => void;
  onPlayEyeAnimation: () => void;
};

export function ConfigInspector({
  config,
  update,
  randomize,
  reset,
  previewEyeAnimation,
  onPreviewEyeAnimationChange,
  onPlayEyeAnimation,
}: InspectorProps) {
  return (
    <div className="inspector">
      <div className="inspector-heading">
        <div>
          <p className="section-index">01</p>
          <h2>Configure</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={randomize}
          data-testid="randomize"
        >
          <ShuffleIcon data-icon="inline-start" />
          Randomize mood
        </Button>
      </div>

      <div className="control-group">
        <p className="control-group-title">Appearance</p>
        <ControlRow label="Expression">
          <Select
            value={config.expression}
            onValueChange={(value) => update("expression", value)}
          >
            <SelectTrigger aria-label="Expression" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {DISPLAY_EXPRESSIONS.map((expression) => (
                  <SelectItem key={expression} value={expression}>
                    {expression}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow label="Body shape">
          <Select
            value={config.shape}
            onValueChange={(value) =>
              update("shape", value as PlaygroundConfig["shape"])
            }
          >
            <SelectTrigger aria-label="Body shape" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {BODY_SHAPES.map((shape) => (
                  <SelectItem key={shape} value={shape}>
                    {shape}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow label="Body color">
          <div className="color-control">
            <input
              aria-label="Body color picker"
              type="color"
              value={config.color}
              onChange={(event) => update("color", event.target.value)}
            />
            <Input
              aria-label="Body color"
              value={config.color}
              onChange={(event) => update("color", event.target.value)}
              maxLength={7}
            />
          </div>
        </ControlRow>
        <ControlRow label="Eye color">
          <div className="color-control">
            <input
              aria-label="Eye color picker"
              type="color"
              value={config.eyeColor}
              onChange={(event) => update("eyeColor", event.target.value)}
            />
            <Input
              aria-label="Eye color"
              value={config.eyeColor}
              onChange={(event) => update("eyeColor", event.target.value)}
              maxLength={7}
            />
          </div>
        </ControlRow>
      </div>

      <Separator />

      <div className="control-group">
        <p className="control-group-title">Motion</p>
        <ControlRow label="Motion preset">
          <Select
            value={config.motion}
            onValueChange={(value) =>
              update("motion", value as PlaygroundConfig["motion"])
            }
          >
            <SelectTrigger aria-label="Motion preset" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MOTION_PRESETS.map((motion) => (
                  <SelectItem key={motion} value={motion}>
                    {motion}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow
          label="Expressiveness"
          value={`${config.expressiveness.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Expression intensity"
            min={0}
            max={2}
            step={0.05}
            value={[config.expressiveness]}
            onValueChange={([value]) => update("expressiveness", value)}
          />
        </ControlRow>
        <ControlRow
          label="Performance time"
          value={`${config.expressionDuration}ms`}
          vertical
        >
          <Slider
            aria-label="Expression duration"
            min={180}
            max={1200}
            step={20}
            value={[config.expressionDuration]}
            onValueChange={([value]) => update("expressionDuration", value)}
          />
        </ControlRow>
        <ControlRow label="Eye performance">
          <Switch
            checked={config.eyePerformance}
            onCheckedChange={(value) => update("eyePerformance", value)}
            aria-label="Eye performance"
          />
        </ControlRow>
        <ControlRow label="Body performance">
          <Switch
            checked={config.bodyPerformance}
            onCheckedChange={(value) => update("bodyPerformance", value)}
            aria-label="Body performance"
          />
        </ControlRow>
        <ControlRow
          label="Anticipation"
          value={config.expressionAnticipation.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Expression anticipation"
            min={0}
            max={1}
            step={0.05}
            value={[config.expressionAnticipation]}
            onValueChange={([value]) => update("expressionAnticipation", value)}
          />
        </ControlRow>
        <ControlRow
          label="Overshoot"
          value={config.expressionOvershoot.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Expression overshoot"
            min={0}
            max={1}
            step={0.05}
            value={[config.expressionOvershoot]}
            onValueChange={([value]) => update("expressionOvershoot", value)}
          />
        </ControlRow>
        <ControlRow
          label="Eye stagger"
          value={String(config.eyeStagger) + "ms"}
          vertical
        >
          <Slider
            aria-label="Eye transition stagger"
            min={0}
            max={120}
            step={5}
            value={[config.eyeStagger]}
            onValueChange={([value]) => update("eyeStagger", value)}
          />
        </ControlRow>
        <ControlRow label="Stiffness" value={String(config.stiffness)} vertical>
          <Slider
            aria-label="Spring stiffness"
            min={20}
            max={500}
            step={5}
            value={[config.stiffness]}
            onValueChange={([value]) => update("stiffness", value)}
          />
        </ControlRow>
        <ControlRow label="Damping" value={String(config.damping)} vertical>
          <Slider
            aria-label="Spring damping"
            min={1}
            max={80}
            value={[config.damping]}
            onValueChange={([value]) => update("damping", value)}
          />
        </ControlRow>
        <ControlRow label="Mass" value={config.mass.toFixed(1)} vertical>
          <Slider
            aria-label="Spring mass"
            min={0.1}
            max={3}
            step={0.1}
            value={[config.mass]}
            onValueChange={([value]) => update("mass", value)}
          />
        </ControlRow>
      </div>

      <Separator />

      <div className="control-group">
        <p className="control-group-title">Behavior</p>
        <ControlRow label="Pointer tracking">
          <Switch
            checked={config.pointer}
            onCheckedChange={(value) => update("pointer", value)}
            aria-label="Pointer tracking"
          />
        </ControlRow>
        <ControlRow label="Tracking area">
          <Select
            value={config.pointerTarget}
            onValueChange={(value) =>
              update(
                "pointerTarget",
                value as PlaygroundConfig["pointerTarget"],
              )
            }
          >
            <SelectTrigger
              aria-label="Pointer tracking area"
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {POINTER_TARGETS.map((target) => (
                  <SelectItem key={target} value={target}>
                    {target === "parent" ? "full canvas" : "face only"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow
          label="Cursor sensitivity"
          value={`${config.pointerStrength.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Cursor sensitivity"
            min={0}
            max={3}
            step={0.05}
            value={[config.pointerStrength]}
            onValueChange={([value]) => update("pointerStrength", value)}
          />
        </ControlRow>
        <ControlRow
          label="Horizontal travel"
          value={`${config.pointerRangeX.toFixed(0)}u`}
          vertical
        >
          <Slider
            aria-label="Horizontal cursor travel"
            min={0}
            max={30}
            step={1}
            value={[config.pointerRangeX]}
            onValueChange={([value]) => update("pointerRangeX", value)}
          />
        </ControlRow>
        <ControlRow
          label="Vertical travel"
          value={`${config.pointerRangeY.toFixed(0)}u`}
          vertical
        >
          <Slider
            aria-label="Vertical cursor travel"
            min={0}
            max={24}
            step={1}
            value={[config.pointerRangeY]}
            onValueChange={([value]) => update("pointerRangeY", value)}
          />
        </ControlRow>
        <ControlRow
          label="Cursor tilt"
          value={`${config.pointerTilt.toFixed(1)}°`}
          vertical
        >
          <Slider
            aria-label="Cursor tilt"
            min={0}
            max={10}
            step={0.5}
            value={[config.pointerTilt]}
            onValueChange={([value]) => update("pointerTilt", value)}
          />
        </ControlRow>
        <ControlRow label="Surface realism">
          <Switch
            checked={config.surface}
            onCheckedChange={(value) => update("surface", value)}
            aria-label="Surface realism"
          />
        </ControlRow>
        <ControlRow
          label="Perspective"
          value={config.surfacePerspective.toFixed(2) + "×"}
          vertical
        >
          <Slider
            aria-label="Surface perspective"
            min={0}
            max={2}
            step={0.05}
            value={[config.surfacePerspective]}
            onValueChange={([value]) => update("surfacePerspective", value)}
          />
        </ControlRow>
        <ControlRow
          label="Edge compression"
          value={config.edgeCompression.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Edge compression"
            min={0}
            max={1}
            step={0.05}
            value={[config.edgeCompression]}
            onValueChange={([value]) => update("edgeCompression", value)}
          />
        </ControlRow>
        <ControlRow
          label="Surface depth"
          value={config.surfaceDepth.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Surface depth"
            min={0}
            max={1}
            step={0.05}
            value={[config.surfaceDepth]}
            onValueChange={([value]) => update("surfaceDepth", value)}
          />
        </ControlRow>
        <ControlRow
          label="Volume preservation"
          value={config.surfaceVolumePreservation.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Surface volume preservation"
            min={0}
            max={1}
            step={0.05}
            value={[config.surfaceVolumePreservation]}
            onValueChange={([value]) =>
              update("surfaceVolumePreservation", value)
            }
          />
        </ControlRow>
        <ControlRow
          label="Body follow"
          value={config.bodyFollow.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Body follow"
            min={0}
            max={1}
            step={0.05}
            value={[config.bodyFollow]}
            onValueChange={([value]) => update("bodyFollow", value)}
          />
        </ControlRow>
        <ControlRow
          label="Surface inertia"
          value={config.surfaceInertia.toFixed(2)}
          vertical
        >
          <Slider
            aria-label="Surface inertia"
            min={0}
            max={1}
            step={0.05}
            value={[config.surfaceInertia]}
            onValueChange={([value]) => update("surfaceInertia", value)}
          />
        </ControlRow>
        <ControlRow
          label="Maximum turn"
          value={String(config.maxTurn) + "°"}
          vertical
        >
          <Slider
            aria-label="Maximum surface turn"
            min={0}
            max={70}
            step={1}
            value={[config.maxTurn]}
            onValueChange={([value]) => update("maxTurn", value)}
          />
        </ControlRow>
        <ControlRow label="Auto blink">
          <Switch
            checked={config.blink}
            onCheckedChange={(value) => update("blink", value)}
            aria-label="Auto blink"
          />
        </ControlRow>
        <ControlRow label="Eye reactions">
          <Switch
            checked={config.eyeMotion}
            onCheckedChange={(value) => update("eyeMotion", value)}
            aria-label="Eye reactions"
          />
        </ControlRow>
        <ControlRow label="Performance cue" vertical>
          <div className="flex w-full gap-2">
            <Select
              value={previewEyeAnimation}
              onValueChange={(value) =>
                onPreviewEyeAnimationChange(value as EyeAnimationName)
              }
            >
              <SelectTrigger aria-label="Performance cue" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {EYE_PERFORMANCES.map((animation) => (
                    <SelectItem key={animation} value={animation}>
                      {animation}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={onPlayEyeAnimation}
              aria-label={`Play ${previewEyeAnimation} eye performance`}
            >
              <PlayIcon data-icon="inline-start" />
              Play
            </Button>
          </div>
        </ControlRow>
        <ControlRow label="Idle eye motion">
          <Switch
            checked={config.idleEyeMotion}
            onCheckedChange={(value) => update("idleEyeMotion", value)}
            aria-label="Idle eye motion"
          />
        </ControlRow>
        <ControlRow label="Hover eye cue">
          <Select
            value={config.hoverEyeMotion}
            onValueChange={(value) =>
              update(
                "hoverEyeMotion",
                value as PlaygroundConfig["hoverEyeMotion"],
              )
            }
          >
            <SelectTrigger aria-label="Hover eye cue" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {EYE_ANIMATIONS.map((animation) => (
                  <SelectItem key={animation} value={animation}>
                    {animation}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow label="Hover body cue">
          <Select
            value={config.hoverReaction}
            onValueChange={(value) =>
              update(
                "hoverReaction",
                value as PlaygroundConfig["hoverReaction"],
              )
            }
          >
            <SelectTrigger aria-label="Hover body cue" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {HOVER_REACTIONS.map((reaction) => (
                  <SelectItem key={reaction} value={reaction}>
                    {reaction}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ControlRow>
        <ControlRow label="Right-click blink">
          <Switch
            checked={config.contextMenuBlink}
            onCheckedChange={(value) => update("contextMenuBlink", value)}
            aria-label="Right-click blink"
          />
        </ControlRow>
        <ControlRow
          label="Eye reaction strength"
          value={`${config.eyeMotionIntensity.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Eye reaction strength"
            min={0}
            max={2}
            step={0.05}
            value={[config.eyeMotionIntensity]}
            onValueChange={([value]) => update("eyeMotionIntensity", value)}
          />
        </ControlRow>
        <ControlRow
          label="Idle delay min"
          value={`${config.eyeMotionIntervalMin}ms`}
          vertical
        >
          <Slider
            aria-label="Minimum idle eye delay"
            min={500}
            max={config.eyeMotionIntervalMax}
            step={100}
            value={[config.eyeMotionIntervalMin]}
            onValueChange={([value]) => update("eyeMotionIntervalMin", value)}
          />
        </ControlRow>
        <ControlRow
          label="Idle delay max"
          value={`${config.eyeMotionIntervalMax}ms`}
          vertical
        >
          <Slider
            aria-label="Maximum idle eye delay"
            min={config.eyeMotionIntervalMin}
            max={12000}
            step={100}
            value={[config.eyeMotionIntervalMax]}
            onValueChange={([value]) => update("eyeMotionIntervalMax", value)}
          />
        </ControlRow>
        <ControlRow label="Auto expressions">
          <Switch
            checked={config.auto}
            onCheckedChange={(value) => update("auto", value)}
            aria-label="Auto expressions"
          />
        </ControlRow>
        <ControlRow
          label="Eye scale"
          value={`${config.eyeScale.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Eye scale"
            min={0.6}
            max={1.6}
            step={0.02}
            value={[config.eyeScale]}
            onValueChange={([value]) => update("eyeScale", value)}
          />
        </ControlRow>
        <ControlRow
          label="Eye distance"
          value={`${config.eyeDistance.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Eye distance"
            min={0.6}
            max={1.5}
            step={0.02}
            value={[config.eyeDistance]}
            onValueChange={([value]) => update("eyeDistance", value)}
          />
        </ControlRow>
        <ControlRow
          label="Gaze range"
          value={`${config.gazeLimit.toFixed(2)}×`}
          vertical
        >
          <Slider
            aria-label="Gaze range"
            min={0}
            max={2}
            step={0.05}
            value={[config.gazeLimit]}
            onValueChange={([value]) => update("gazeLimit", value)}
          />
        </ControlRow>
        <ControlRow label="Preview size" value={`${config.size}px`} vertical>
          <Slider
            aria-label="Preview size"
            min={180}
            max={480}
            step={10}
            value={[config.size]}
            onValueChange={([value]) => update("size", value)}
          />
        </ControlRow>
      </div>

      <div className="inspector-footer">
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset defaults
        </Button>
        <span>16 presets · 11 shapes</span>
      </div>
    </div>
  );
}
