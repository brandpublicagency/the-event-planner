
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { Toaster } from '@/components/ui/toaster';
import { SidebarToasts } from '@/components/sidebar/SidebarToasts';
import { ToastProvider } from '@/components/ui/toast/toast-context';
import { MenuProvider } from '@/contexts/MenuContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <MenuProvider>
            {children}
            <Toaster />
            <SidebarToasts />
          </MenuProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
