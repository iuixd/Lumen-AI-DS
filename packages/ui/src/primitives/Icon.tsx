import { forwardRef, type SVGProps } from "react";
import { iconRegistry, type IconName } from "../icons/generated/registry";

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

/**
 * Looks up a generated Iconly icon by name — for data-driven cases (a table
 * column config, a menu item list) where the icon isn't known until render.
 * Prefer importing the specific `{Name}Icon` component directly when the
 * icon is static in the JSX, so bundlers can tree-shake unused icons.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const Component = iconRegistry[name];
  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon: no icon registered under name "${name}"`);
    }
    return null;
  }
  return <Component ref={ref} {...props} />;
});
Icon.displayName = "Icon";
