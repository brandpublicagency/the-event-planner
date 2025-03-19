
import * as React from "react"
import { X, CheckCircle2, AlertCircle, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as ToastPrimitives from "@radix-ui/react-toast"

// Define ToastProps separately without extending Radix props to avoid the circular reference
export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  position?: "top" | "bottom" | "sidebar";
  showProgress?: boolean;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
  // Add other needed props from RadixUI without extending
  className?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onSwipeStart?: (event: React.TouchEvent | MouseEvent) => void;
  onSwipeMove?: (event: React.TouchEvent | MouseEvent) => void;
  onSwipeEnd?: (event: React.TouchEvent | MouseEvent) => void;
  forceMount?: true;
  altText?: string;
}

export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>

// Global store for tracking toasts we've shown to prevent duplicates
// Use a Map with timestamps to track when toasts were shown
const shownToasts = new Map<string, number>();
const MAX_TRACKED_TOASTS = 10; // Limit memory usage
const DEDUPE_WINDOW = 5000; // 5 second window for deduplication

// This is a client-side only function
export const toast = ({
  variant = "default",
  title,
  description,
  duration = 5000,
  action,
  position = "bottom",
  showProgress = false,
  ...props
}: ToastProps) => {
  // We access the clientside toast implementation and inject our custom props
  if (typeof window === "undefined") return { id: "server-toast" }; // Return a dummy ID when rendering on server
  
  const { toast: clientToast } = (window as any).__TOAST_PROVIDER__ || {};
  
  if (!clientToast) {
    console.error("Toast provider not found. Make sure ToastProvider is mounted.");
    return { id: "error-toast" };
  }
  
  // Create a deduplication key that includes all important properties
  const toastKey = `${variant}:${String(title)}:${String(description)}`;
  
  const now = Date.now();
  // Skip this toast if it's identical to one we've shown in the last 5 seconds
  if (shownToasts.has(toastKey)) {
    const lastShown = shownToasts.get(toastKey) || 0;
    if (now - lastShown < DEDUPE_WINDOW) {
      console.log(`Skipping duplicate toast: ${toastKey}`);
      return { id: "duplicate-toast" };
    }
  }
  
  // Limit the size of our tracking Map
  if (shownToasts.size > MAX_TRACKED_TOASTS) {
    // Delete the oldest entries when we reach capacity
    const entries = Array.from(shownToasts.entries());
    entries.sort((a, b) => a[1] - b[1]).slice(0, Math.floor(MAX_TRACKED_TOASTS / 2))
      .forEach(([key]) => shownToasts.delete(key));
  }
  
  // Update tracking with current timestamp
  shownToasts.set(toastKey, now);
  
  return clientToast({
    variant,
    title,
    description,
    duration,
    action,
    position,
    showProgress,
    ...props,
  });
};
