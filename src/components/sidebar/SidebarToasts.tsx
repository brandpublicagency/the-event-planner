
import React from "react";
import { Toaster } from "sonner";

export const SidebarToasts = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className: "rounded-md border shadow-md",
        duration: 5000,
        style: {
          background: "white",
          borderRadius: "0.75rem",
          color: "black",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        },
      }}
    />
  );
};
