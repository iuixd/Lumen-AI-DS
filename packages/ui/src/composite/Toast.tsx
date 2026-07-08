import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "error" | "warning";
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const toneClass: Record<NonNullable<ToastItem["tone"]>, string> = {
  neutral: "border-[var(--color-border-default)]",
  success: "border-[var(--color-status-success)]",
  error: "border-[var(--color-status-error)]",
  warning: "border-[var(--color-status-warning)]"
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "w-80 rounded-lg border-l-4 bg-[var(--color-background-raised)] p-4 shadow-2",
              toneClass[t.tone ?? "neutral"]
            )}
          >
            <p className="text-title-sm text-[var(--color-text-title)]">{t.title}</p>
            {t.description && <p className="text-body-sm text-[var(--color-text-muted)]">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
