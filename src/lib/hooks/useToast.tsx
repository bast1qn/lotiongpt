'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  showToastWithAction: (message: string, type: ToastType, action: ToastAction, duration?: number) => string;
  hideToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const showToastWithAction = useCallback((
    message: string,
    type: ToastType,
    action: ToastAction,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, duration, action };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message: string, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration = 4000) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration = 3500) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      showToast,
      showToastWithAction,
      hideToast,
      success,
      error,
      info,
      warning,
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
