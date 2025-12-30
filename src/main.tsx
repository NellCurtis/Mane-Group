import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './lib/supabase.ts';

// Initialize database connection
initializeDatabase().catch(console.error);

// Register service worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('ServiceWorker registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);