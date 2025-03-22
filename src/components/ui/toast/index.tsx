
import { Toast, toastVariants, type ToastProps } from "./components/Toast"
import { ToastAction } from "./components/ToastAction"
import { ToastClose } from "./components/ToastClose"
import { ToastTitle, ToastDescription } from "./components/ToastContent"
import { ToastIcon } from "./components/ToastIcon"
import { ToastProvider, ToastViewport } from "./components/ToastProvider"
import { ToastWithIcon, ToastWithProgress } from "./components/ToastVariants"

// Define ToastActionElement without conflicting with the export
import type { ReactElement } from "react"
import { ToastAction as ToastActionType } from "./components/ToastAction"
type ToastActionElement = ReactElement<typeof ToastActionType>

export {
  type ToastProps,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  ToastWithIcon,
  ToastWithProgress,
  toastVariants,
  // Export the type, not as a named export to avoid conflict
  type ToastActionElement,
}
