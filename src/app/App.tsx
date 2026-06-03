import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GamesPage } from '../pages/GamesPage';
import { CharacterCreatePage } from '../pages/CharacterCreatePage';
import { PlayPage } from '../pages/PlayPage';
import { DiagnosticsPage } from '../pages/DiagnosticsPage';

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
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/games" element={<RequireAuth><GamesPage /></RequireAuth>} />
      <Route path="/games/:gameStateId/character" element={<RequireAuth><CharacterCreatePage /></RequireAuth>} />
      <Route path="/play/:gameStateId" element={<RequireAuth><PlayPage /></RequireAuth>} />
      <Route path="/diagnostics" element={<RequireAuth><DiagnosticsPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
