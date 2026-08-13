import {
  ArrowRightIcon,
  BotIcon,
  CopyIcon,
  FileTextIcon,
  GitForkIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const installCommand =
  "npm install https://github.com/arhxam/moodie-react/releases/latest/download/moodie-react.tgz motion";

const rows = [
  [
    "expression",
    "ExpressionName | string",
    '"neutral"',
    "Preset or custom expression key.",
  ],
  [
    "shape",
    "ShapeName",
    '"circle"',
    "Circle, squircle, blob, pebble, or diamond.",
  ],
  ["color / eyeColor", "string", "#5b6cff / #0a0a0a", "Any valid CSS color."],
  [
    "motion",
    "MotionPreset",
    '"spring"',
    "Spring, gentle, snappy, bouncy, tween, or none.",
  ],
  ["spring", "SpringConfig", "210 / 22 / 0.8", "Stiffness, damping, and mass."],
  [
    "expressionMotion",
    "boolean | config",
    "true",
    "Body reaction and semantic eye performance on expression changes.",
  ],
  [
    "pointer",
    "boolean | config",
    "true",
    "Sensitivity, horizontal/vertical travel, cursor tilt, and enablement.",
  ],
  [
    "blink / auto",
    "boolean | config",
    "mixed",
    "Behavior shorthands or detailed cadence configuration.",
  ],
  [
    "clickAction",
    '"react" | "cycle" | "random"',
    '"react"',
    "Choose the face's click behavior.",
  ],
  [
    "ref",
    "MoodieHandle",
    "—",
    "Imperatively blink, react, lookAt, or setExpression.",
  ],
] as const;

export function ApiSection() {
  const copyInstall = async () => {
    await navigator.clipboard.writeText(installCommand);
    toast.success("Install command copied");
  };

  return (
    <section
      id="api"
      className="api-section page-shell"
      aria-labelledby="api-title"
    >
      <div className="section-heading">
        <div>
          <p className="section-index">API</p>
          <h2 id="api-title">
            Small surface.
            <br />
            Plenty of range.
          </h2>
        </div>
        <p>
          The common path stays compact. Advanced behavior is grouped into
          readable objects and every option is typed.
        </p>
      </div>
      <div
        id="install"
        className="api-install"
        role="group"
        aria-label="Install command"
      >
        <div>
          <span>$</span>
          <code>{installCommand}</code>
        </div>
        <Button variant="outline" size="sm" onClick={copyInstall}>
          <CopyIcon data-icon="inline-start" />
          Copy command
        </Button>
      </div>
      <div className="api-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([prop, type, value, description]) => (
              <tr key={prop}>
                <td>
                  <code>{prop}</code>
                </td>
                <td>{type}</td>
                <td>
                  <code>{value}</code>
                </td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="llm-guide" className="llm-guide">
        <div className="llm-icon">
          <BotIcon />
        </div>
        <div>
          <p className="section-index">Built for people and agents</p>
          <h2>Let your LLM wire it up.</h2>
          <p>
            Copy <code>llms.txt</code> into context or point your coding agent
            at the integration guide. It includes the full prop model, patterns,
            accessibility notes, and ready-to-adapt examples.
          </p>
        </div>
        <div className="llm-actions">
          <Button asChild>
            <a href="/llms.txt">
              <FileTextIcon data-icon="inline-start" />
              Open llms.txt
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/arhxam/moodie-react/blob/master/docs/llm-guide.md"
              target="_blank"
              rel="noreferrer"
            >
              <GitForkIcon data-icon="inline-start" />
              LLM guide
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
