import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="hero page-shell">
      <div className="hero-copy">
        <h1>
          Give your interface
          <br />a little life.
        </h1>
        <p>
          A tiny, deeply configurable face for loading states, empty screens,
          assistants, and everything between.
        </p>
        <div className="hero-actions">
          <Button size="lg" asChild>
            <a href="#playground">
              Open playground <ArrowDownIcon data-icon="inline-end" />
            </a>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a href="#api">
              Read the docs <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
