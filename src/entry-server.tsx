import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './App';
import { ROUTE_META } from './data/routeMeta';

export { ROUTE_META };

export function render(url: string) {
  const html = renderToString(
    <GoogleOAuthProvider clientId="prerender-build">
      <AuthProvider>
        <MemoryRouter initialEntries={[url]}>
          <AppShell />
        </MemoryRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
  return { html };
}
