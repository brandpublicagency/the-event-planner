import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <TaskProvider>
          <Toaster />
          <Sonner />
          {children}
        </TaskProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};