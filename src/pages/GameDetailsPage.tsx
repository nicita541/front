import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getCharacters, getGameStates } from '../shared/api/gameApi';

export function GameDetailsPage() {
  const { gameStateId = '' } = useParams();
  const gamesQuery = useQuery({ queryKey: ['game-states'], queryFn: getGameStates });
  const charactersQuery = useQuery({ queryKey: ['characters', gameStateId], queryFn: () => getCharacters(gameStateId), enabled: Boolean(gameStateId) });
  const game = useMemo(() => gamesQuery.data?.find((item) => item.id === gameStateId), [gamesQuery.data, gameStateId]);
  const characters = charactersQuery.data ?? [];

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Кампания</span>
          <h1>{game?.name ?? 'Детали игры'}</h1>
          <p>{gameStateId}</p>
        </div>
        <div className="row-actions">
          <Link className="secondary-button" to="/games">Все игры</Link>
          <Link className="primary-button" to={`/play/${gameStateId}`}>Играть</Link>
        </div>
      </header>

      <section className="grid dashboard-grid">
        <article className="panel metric-card">
          <span>Персонажей</span>
          <strong>{characters.length}</strong>
          <p>Герои, явно созданные для этой кампании.</p>
        </article>
        <article className="panel metric-card">
          <span>Локация</span>
          <strong>{game?.currentLocationId ? 'есть' : '-'}</strong>
          <p>{game?.currentLocationId ?? 'Backend пока не вернул currentLocationId.'}</p>
        </article>
        <article className="panel metric-card">
          <span>Статус</span>
          <strong>{gamesQuery.isError || charactersQuery.isError ? 'ошибка' : 'готово'}</strong>
          <p>Проверка game-states и characters API.</p>
        </article>
      </section>

      <section className="grid two-columns">
        <div className="panel">
          <h2>Персонажи</h2>
          {charactersQuery.isLoading && <div className="info-box">Загружаю персонажей...</div>}
          {charactersQuery.isError && <div className="error-box">Не удалось загрузить персонажей.</div>}
          {charactersQuery.isSuccess && characters.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>Героев пока нет</h3>
              <p>Создай персонажа для этой кампании, чтобы начать играть.</p>
            </div>
          )}
          <div className="cards-list">
            {characters.map((character) => (
              <article className="game-card" key={character.id}>
                <div>
                  <h3>{character.name}</h3>
                  <p>{character.className ?? 'Класс не указан'} · уровень {character.level ?? 1} · XP {character.experience ?? 0}</p>
                </div>
                {character.levelUpAvailable && <span className="badge">Level up</span>}
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Быстрые действия</h2>
          <div className="quick-link-list">
            <Link className="quick-link" to={`/games/${gameStateId}/character`}><strong>Создать героя</strong><span>Открыть форму персонажа для этой кампании.</span></Link>
            <Link className="quick-link" to={`/play/${gameStateId}`}><strong>Игровой стол</strong><span>Перейти к сцене, журналу, инвентарю и прогрессу.</span></Link>
            <Link className="quick-link" to="/diagnostics"><strong>Диагностика API</strong><span>Проверить auth/me и game-states.</span></Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
