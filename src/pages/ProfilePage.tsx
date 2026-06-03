import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getMe } from '../shared/api/authApi';
import { API_BASE_URL } from '../shared/api/http';
import './ProfilePage.css';

export function ProfilePage() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });
  const account = meQuery.data;
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'));
  const hasRefreshToken = Boolean(localStorage.getItem('refreshToken'));
  const avatarLetter = (account?.displayName ?? account?.username ?? account?.email ?? '?').slice(0, 1).toUpperCase();

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Профиль</span>
          <h1>{account?.displayName ?? account?.username ?? 'Аккаунт игрока'}</h1>
          <p>Информация о пользователе, токенах и подключении к backend.</p>
        </div>
        <div className="row-actions">
          <Link className="secondary-button" to="/diagnostics">Диагностика API</Link>
          <Link className="primary-button" to="/games">Мои игры</Link>
        </div>
      </header>

      <section className="grid two-columns">
        <div className="panel profile-card">
          <div className="profile-avatar">{avatarLetter}</div>
          <h2>Аккаунт</h2>
          {meQuery.isLoading && <div className="info-box">Загружаю профиль...</div>}
          {meQuery.isError && <div className="error-box">Не удалось загрузить /api/auth/me.</div>}
          <div className="diagnostic-row"><span>Email</span><strong>{account?.email ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Username</span><strong>{account?.username ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Display name</span><strong>{account?.displayName ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Role</span><strong>{account?.role ?? 'user'}</strong></div>
        </div>

        <div className="panel">
          <p className="profile-section-title">Сессия и backend</p>
          <div className="diagnostic-row"><span>API</span><strong>{API_BASE_URL}</strong></div>
          <div className="profile-token-grid">
            <div className="profile-token-card"><span>Access token</span><strong>{hasAccessToken ? 'есть' : 'нет'}</strong></div>
            <div className="profile-token-card"><span>Refresh token</span><strong>{hasRefreshToken ? 'есть' : 'нет'}</strong></div>
          </div>
          <div className="info-box">Если backend вернёт 401, frontend очистит токены и вернёт тебя на страницу входа.</div>
        </div>
      </section>
    </AppShell>
  );
}
