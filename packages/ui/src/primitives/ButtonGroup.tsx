import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface ClassNameProps {
  className?: string;
}

/** Maps to Figma "Button Groups" component set — a connected row of buttons
 * sharing borders, used for segmented actions (view toggles, bulk actions). */
export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ClassNameProps>[];
  return (
    <div className={cn("inline-flex overflow-hidden rounded-lg border border-[var(--color-border-default)]", className)} role="group">
      {items.map((child, i) =>
        cloneElement(child, {
          key: i,
          className: cn(child.props.className, "rounded-none", i !== 0 && "border-l border-[var(--color-border-default)]")
        } as ClassNameProps & { key: number })
      )}
    </div>
  );
}
