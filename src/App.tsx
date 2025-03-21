
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from './routes/AppRoutes';
import { AppProviders } from "./providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
    </AppProviders>
  );
}

export default App;
