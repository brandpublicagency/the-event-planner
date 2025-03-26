
import React from "react";
import { Toaster } from "sonner";

export const SidebarToasts = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          backgroundColor: "white",
          borderRadius: "0.5rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          padding: "0.75rem"
        },
      }}
    />
  );
};
