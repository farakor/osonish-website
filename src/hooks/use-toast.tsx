"use client";

import * as React from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

let toastCount = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((props: Omit<Toast, "id">) => {
    const id = (toastCount++).toString();
    const newToast: Toast = {
      id,
      ...props,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[300px] rounded-lg border p-4 shadow-lg ${
              toast.variant === "destructive"
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            {toast.title && (
              <h3
                className={`font-semibold ${
                  toast.variant === "destructive"
                    ? "text-red-900"
                    : "text-gray-900"
                }`}
              >
                {toast.title}
              </h3>
            )}
            {toast.description && (
              <p
                className={`text-sm mt-1 ${
                  toast.variant === "destructive"
                    ? "text-red-700"
                    : "text-gray-600"
                }`}
              >
                {toast.description}
              </p>
            )}
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

