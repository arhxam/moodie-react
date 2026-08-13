import {
  BracesIcon,
  BoxIcon,
  GaugeIcon,
  GitForkIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

const features = [
  {
    icon: BoxIcon,
    title: "Tiny & tree-shakeable",
    copy: "SVG paths and React. No canvas, image assets, or runtime stylesheet.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Deeply configurable",
    copy: "Fine-tune motion, gaze, blink, geometry, behavior, and color.",
  },
  {
    icon: GaugeIcon,
    title: "Smooth by default",
    copy: "Topology-safe SVG morphs animated with natural spring physics.",
  },
  {
    icon: BracesIcon,
    title: "Drop-in simple",
    copy: "One component, typed props, controlled or uncontrolled state.",
  },
  {
    icon: GitForkIcon,
    title: "Open source",
    copy: "MIT licensed, documented, accessible, and ready to extend.",
  },
] as const;

export function Features() {
  return (
    <section className="feature-rail page-shell" aria-label="Moodie features">
      {features.map(({ icon: Icon, title, copy }) => (
        <article key={title}>
          <Icon />
          <div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
