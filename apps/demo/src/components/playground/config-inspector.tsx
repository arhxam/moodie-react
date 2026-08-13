import { RotateCcwIcon, ShuffleIcon } from "lucide-react";

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
  MOTION_PRESETS,
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
};

export function ConfigInspector({
  config,
  update,
  randomize,
  reset,
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
        <ControlRow label="Auto blink">
          <Switch
            checked={config.blink}
            onCheckedChange={(value) => update("blink", value)}
            aria-label="Auto blink"
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
        <span>16 presets · 5 shapes</span>
      </div>
    </div>
  );
}
