import { GitForkIcon, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  ["Playground", "#playground"],
  ["Presets", "#presets"],
  ["API", "#api"],
  ["LLM guide", "#llm-guide"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-shell site-header-inner">
        <a className="wordmark" href="#top" aria-label="Moodie home">
          <span className="wordmark-face">
            <i />
            <i />
          </span>
          moodie
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <Button variant="ghost" size="sm" asChild className="github-button">
            <a
              href="https://github.com/arhxam/custom-icon"
              target="_blank"
              rel="noreferrer"
            >
              <GitForkIcon data-icon="inline-start" /> GitHub
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="#install">Install</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mobile-menu"
                aria-label="Open navigation"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Navigate Moodie</SheetTitle>
              <SheetDescription>
                Play with the component or jump into its documentation.
              </SheetDescription>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                {nav.map(([label, href]) => (
                  <SheetClose asChild key={label}>
                    <a href={href}>{label}</a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href="https://github.com/arhxam/custom-icon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
