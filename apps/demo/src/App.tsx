import { Playground } from "@/components/playground/playground";
import { ApiSection } from "@/components/sections/api-section";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { PresetGallery } from "@/components/sections/preset-gallery";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <SiteHeader />
      <main>
        <Hero />
        <Playground />
        <PresetGallery />
        <Features />
        <ApiSection />
      </main>
      <SiteFooter />
      <Toaster position="bottom-center" />
    </TooltipProvider>
  );
}
