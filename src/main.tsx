import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ErrorBoundary } from './components/ErrorBoundary';

console.log('main.tsx executing');

const root = document.getElementById('root');
console.log('Root element:', root);

createRoot(root!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
