import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getMe } from '../shared/api/authApi';
import { API_BASE_URL } from '../shared/api/http';

export function ProfilePage() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });
  const account = meQuery.data;
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'));
  const hasRefreshToken = Boolean(localStorage.getItem('refreshToken'));

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Профиль</span>
          <h1>{account?.displayName ?? account?.username ?? 'Аккаунт игрока'}</h1>
          <p>Информация о пользователе, токенах и подключении к backend.</p>
        </div>
        <Link className="secondary-button" to="/diagnostics">Диагностика API</Link>
      </header>

      <section className="grid two-columns">
        <div className="panel profile-card">
          <div className="profile-avatar">{(account?.displayName ?? account?.username ?? account?.email ?? '?').slice(0, 1).toUpperCase()}</div>
          {meQuery.isLoading && <div className="info-box">Загружаю профиль...</div>}
          {meQuery.isError && <div className="error-box">Не удалось загрузить /api/auth/me.</div>}
          <div className="diagnostic-row"><span>Email</span><strong>{account?.email ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Username</span><strong>{account?.username ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Display name</span><strong>{account?.displayName ?? '-'}</strong></div>
          <div className="diagnostic-row"><span>Role</span><strong>{account?.role ?? 'user'}</strong></div>
        </div>

        <div className="panel">
          <h2>Сессия</h2>
          <div className="diagnostic-row"><span>API</span><strong>{API_BASE_URL}</strong></div>
          <div className="diagnostic-row"><span>Access token</span><strong>{hasAccessToken ? 'есть' : 'нет'}</strong></div>
          <div className="diagnostic-row"><span>Refresh token</span><strong>{hasRefreshToken ? 'есть' : 'нет'}</strong></div>
          <div className="info-box">Если backend вернёт 401, frontend очистит токены и вернёт тебя на страницу входа.</div>
        </div>
      </section>
    </AppShell>
  );
}
