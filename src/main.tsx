import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import { ThemeProvider } from './components/ui/theme';
import { AppStateProvider } from './context/AppState';
import { SelectedCarProvider } from './context/SelectedCar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppStateProvider>
      <SelectedCarProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </SelectedCarProvider>
    </AppStateProvider>
  </React.StrictMode>
);
