import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { InitiativeProvider } from './context/InitiativeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InitiativeProvider>
      <App />
    </InitiativeProvider>
  </StrictMode>
);