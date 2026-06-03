import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clearAuthTokens } from '../shared/api/http';

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function logout() {
    clearAuthTokens();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">D20</span>
          <span>
            <strong>D&D AI Master</strong>
            <small>браузерная RPG</small>
          </span>
        </Link>
        <nav className="nav">
          <NavLink to="/dashboard">Главная</NavLink>
          <NavLink to="/games">Мои игры</NavLink>
          <NavLink to="/profile">Профиль</NavLink>
          <NavLink to="/diagnostics">Диагностика API</NavLink>
          <a href="http://localhost:8080/swagger" target="_blank" rel="noreferrer">Swagger</a>
        </nav>
        <button className="ghost-button" onClick={logout}>Выйти</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
