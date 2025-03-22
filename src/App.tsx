
import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { AppProviders } from "./providers/AppProviders";
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
    </AppProviders>
  );
}

export default App;
