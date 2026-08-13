import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ControlRow({
  label,
  value,
  children,
  vertical = false,
}: {
  label: string;
  value?: string;
  children: ReactNode;
  vertical?: boolean;
}) {
  return (
    <div className={cn("control-row", vertical && "control-row--vertical")}>
      <div className="control-label">
        <span>{label}</span>
        {value ? <output>{value}</output> : null}
      </div>
      <div className="control-input">{children}</div>
    </div>
  );
}
