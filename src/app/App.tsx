import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { GamesPage } from '../pages/GamesPage';
import { CharacterCreatePage } from '../pages/CharacterCreatePage';
import { PlayPage } from '../pages/PlayPage';

function RequireAuth({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/games"
        element={
          <RequireAuth>
            <GamesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/games/:gameStateId/character"
        element={
          <RequireAuth>
            <CharacterCreatePage />
          </RequireAuth>
        }
      />
      <Route
        path="/play/:gameStateId"
        element={
          <RequireAuth>
            <PlayPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/games" replace />} />
    </Routes>
  );
}
