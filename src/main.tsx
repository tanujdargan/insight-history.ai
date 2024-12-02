import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure the root element exists
const root = document.getElementById('root');
if (!root) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
}

createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode>
);