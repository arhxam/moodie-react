import { Moodie } from "@moodie/react";

import { DISPLAY_EXPRESSIONS } from "@/lib/playground";
import { cn } from "@/lib/utils";

export function PresetRail({
  selected,
  onSelect,
  color,
}: {
  selected: string;
  onSelect: (value: string) => void;
  color: string;
}) {
  return (
    <div className="preset-rail" aria-label="Expression presets">
      {DISPLAY_EXPRESSIONS.map((expression) => (
        <button
          type="button"
          key={expression}
          className={cn(
            "preset-button",
            selected === expression && "preset-button--active",
          )}
          aria-pressed={selected === expression}
          onClick={() => onSelect(expression)}
        >
          <span className="preset-face">
            <Moodie
              expression={expression}
              size={54}
              color={selected === expression ? color : "#f1f1f1"}
              blink={false}
              pointer={false}
              motion="snappy"
              ariaLabel={`${expression} expression`}
              clickAction="none"
            />
          </span>
          <span>{expression}</span>
        </button>
      ))}
    </div>
  );
}
