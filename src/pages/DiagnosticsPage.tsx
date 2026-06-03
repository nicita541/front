import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../widgets/AppShell';
import { API_BASE_URL } from '../shared/api/http';
import { getMe } from '../shared/api/authApi';
import { getGameStates } from '../shared/api/gameApi';

export function DiagnosticsPage() {
  const meQuery = useQuery({ queryKey: ['diagnostics-me'], queryFn: getMe, retry: false });
  const gamesQuery = useQuery({ queryKey: ['diagnostics-games'], queryFn: getGameStates, retry: false });

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Диагностика</span>
          <h1>Проверка API</h1>
          <p>Быстрый экран для проверки подключения frontend к backend.</p>
        </div>
      </header>

      <section className="grid two-columns">
        <div className="panel">
          <h2>Настройки</h2>
          <div className="diagnostic-row"><span>API base URL</span><strong>{API_BASE_URL}</strong></div>
          <div className="diagnostic-row"><span>Access token</span><strong>{localStorage.getItem('accessToken') ? 'есть' : 'нет'}</strong></div>
        </div>

        <div className="panel">
          <h2>Auth / me</h2>
          <div className={meQuery.isSuccess ? 'success-box' : meQuery.isError ? 'error-box' : 'info-box'}>
            {meQuery.isLoading && 'Проверяю /api/auth/me...'}
            {meQuery.isSuccess && `OK: ${meQuery.data.email}`}
            {meQuery.isError && 'Ошибка /api/auth/me'}
          </div>
        </div>
      </section>

      <section className="panel diagnostics-panel">
        <h2>Game states</h2>
        <div className={gamesQuery.isSuccess ? 'success-box' : gamesQuery.isError ? 'error-box' : 'info-box'}>
          {gamesQuery.isLoading && 'Проверяю /api/game-states...'}
          {gamesQuery.isSuccess && `OK: найдено ${gamesQuery.data.length}`}
          {gamesQuery.isError && 'Ошибка /api/game-states'}
        </div>
      </section>
    </AppShell>
  );
}
