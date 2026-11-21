import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'unconfigured-client-id';

const rootElement = document.getElementById('root')!;
const app = (
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

const ssrRoute = rootElement.getAttribute('data-ssr-route');
const normPath = window.location.pathname.replace(/\/+$/, '') || '/';
if (rootElement.hasChildNodes() && ssrRoute === normPath && !window.location.search) {
  hydrateRoot(rootElement, app);
} else {
  rootElement.replaceChildren();
  createRoot(rootElement).render(app);
}
