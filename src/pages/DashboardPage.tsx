import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getMe } from '../shared/api/authApi';
import { getGameStates } from '../shared/api/gameApi';

export function DashboardPage() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });
  const gamesQuery = useQuery({ queryKey: ['game-states'], queryFn: getGameStates });
  const games = gamesQuery.data ?? [];
  const lastGame = games[0];

  return (
    <AppShell>
      <header className="dashboard-hero panel">
        <div>
          <span className="eyebrow">Главная</span>
          <h1>Добро пожаловать, {meQuery.data?.displayName ?? meQuery.data?.username ?? 'искатель приключений'}</h1>
          <p>Здесь быстрый старт кампании, последние игры и состояние подключения к backend.</p>
        </div>
        <div className="dashboard-actions">
          <Link className="primary-button" to="/games">Мои игры</Link>
          {lastGame && <Link className="secondary-button" to={`/games/${lastGame.id}`}>Последняя кампания</Link>}
          {lastGame && <Link className="secondary-button" to={`/play/${lastGame.id}`}>Продолжить</Link>}
        </div>
      </header>

      <section className="grid dashboard-grid">
        <article className="panel metric-card">
          <span>Кампаний</span>
          <strong>{games.length}</strong>
          <p>Сохранённые game states из backend.</p>
        </article>
        <article className="panel metric-card">
          <span>Аккаунт</span>
          <strong>{meQuery.data?.role ?? 'user'}</strong>
          <p>{meQuery.data?.email ?? 'Профиль загружается...'}</p>
        </article>
        <article className="panel metric-card">
          <span>API</span>
          <strong>{gamesQuery.isError ? 'ошибка' : 'online'}</strong>
          <p>Проверяется через /api/game-states.</p>
        </article>
      </section>

      <section className="panel recent-panel">
        <h2>Последние кампании</h2>
        {gamesQuery.isLoading && <div className="info-box">Загружаю кампании...</div>}
        {gamesQuery.isError && <div className="error-box">Не удалось загрузить кампании.</div>}
        {gamesQuery.isSuccess && games.length === 0 && (
          <div className="empty-state"><div className="empty-state-icon">✦</div><h3>Начни первую игру</h3><p>Создай кампанию на странице “Мои игры”.</p></div>
        )}
        <div className="cards-list">
          {games.slice(0, 4).map((game) => (
            <article className="game-card" key={game.id}>
              <div>
                <h3>{game.name}</h3>
                <p>{game.id}</p>
              </div>
              <div className="row-actions">
                <Link className="secondary-button" to={`/games/${game.id}`}>Детали</Link>
                <Link className="secondary-button" to={`/games/${game.id}/character`}>Персонаж</Link>
                <Link className="primary-button small" to={`/play/${game.id}`}>Играть</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
