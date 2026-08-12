import { Moodie, expressionPresets } from "@moodie/react";
import { useState } from "react";

import { DISPLAY_EXPRESSIONS } from "@/lib/playground";

const galleryColors = [
  "#5b6cff",
  "#ffca3a",
  "#ff6b6b",
  "#7bdcb5",
  "#a98bff",
  "#ff9f43",
];

export function PresetGallery() {
  const [active, setActive] = useState<string>("happy");

  return (
    <section
      id="presets"
      className="presets-section page-shell"
      aria-labelledby="presets-title"
    >
      <div className="section-heading">
        <div>
          <p className="section-index">Presets</p>
          <h2 id="presets-title">
            One component.
            <br />
            Every mood.
          </h2>
        </div>
        <p>
          Start with an expressive preset, then tune every geometric and
          behavioral detail. Each face below is live.
        </p>
      </div>
      <div className="gallery-grid">
        {DISPLAY_EXPRESSIONS.slice(0, 10).map((expression, index) => (
          <button
            type="button"
            className="gallery-item"
            key={expression}
            onClick={() => setActive(expression)}
            aria-pressed={active === expression}
          >
            <Moodie
              expression={expression}
              color={galleryColors[index % galleryColors.length]}
              size="100%"
              blink={expression === active}
              pointer={{ enabled: true, strength: 0.65 }}
              motion="snappy"
              clickAction="react"
              ariaLabel={`${expressionPresets[expression as keyof typeof expressionPresets].label} preset`}
            />
            <span>{expression}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
