import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  name: string;
}
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* components must be used inside <Tabs>");
  return ctx;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const name = useId();
  const current = value ?? internal;
  const setValue = (v: string) => {
    onValueChange?.(v);
    if (value === undefined) setInternal(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue, name }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="tablist" className={cn("flex gap-1 border-b border-[var(--color-border-default)]", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, setValue } = useTabsContext();
  const selected = active === value;
  return (
    <button
      role="tab"
      aria-selected={selected}
      onClick={() => setValue(value)}
      className={cn(
        "-mb-px border-b-2 px-3 py-2 text-label-lg font-medium transition-colors",
        selected
          ? "border-[var(--color-brand-default)] text-[var(--color-brand-default)]"
          : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-title)]"
      )}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
}
