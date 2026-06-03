import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { createGameState, getGameStates } from '../shared/api/gameApi';

export function GamesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('Новая кампания');
  const gamesQuery = useQuery({ queryKey: ['game-states'], queryFn: getGameStates });
  const createMutation = useMutation({
    mutationFn: createGameState,
    onSuccess: async (game) => {
      await queryClient.invalidateQueries({ queryKey: ['game-states'] });
      navigate(`/games/${game.id}/character`);
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate({ name });
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Кампании</span>
          <h1>Мои игры</h1>
          <p>Создай игру, затем персонажа, затем переходи к игровому столу.</p>
        </div>
      </header>
      <section className="grid two-columns">
        <div className="panel">
          <h2>Сохранения</h2>
          {gamesQuery.isLoading && <p className="muted">Загрузка...</p>}
          {gamesQuery.isError && <div className="error-box">Ошибка загрузки /api/game-states.</div>}
          <div className="cards-list">
            {(gamesQuery.data ?? []).map((game) => (
              <article className="game-card" key={game.id}>
                <div>
                  <h3>{game.name}</h3>
                  <p>{game.id}</p>
                </div>
                <div className="row-actions">
                  <Link className="secondary-button" to={`/games/${game.id}/character`}>Персонаж</Link>
                  <Link className="primary-button small" to={`/play/${game.id}`}>Играть</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <form className="panel" onSubmit={submit}>
          <h2>Новая игра</h2>
          <label>Название</label>
          <input value={name} onChange={(event) => setName(event.target.value)} />
          <button className="primary-button" disabled={createMutation.isPending}>Создать кампанию</button>
        </form>
      </section>
    </AppShell>
  );
}
