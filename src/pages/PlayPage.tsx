import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getPlayStatus, sendPlayerAction } from '../shared/api/playApi';

type CharacterView = {
  id?: string;
  name?: string;
  className?: string;
  level?: number;
  hitPoints?: number;
  maxHitPoints?: number;
  experience?: number;
  gold?: number;
};

export function PlayPage() {
  const { gameStateId = '' } = useParams();
  const queryClient = useQueryClient();
  const [action, setAction] = useState('Осмотреть следы и проверить, нет ли засады рядом.');
  const statusQuery = useQuery({ queryKey: ['play-status', gameStateId], queryFn: () => getPlayStatus(gameStateId), enabled: Boolean(gameStateId) });
  const character = (statusQuery.data?.character ?? {}) as CharacterView;
  const entries = useMemo(() => statusQuery.data?.journal ?? statusQuery.data?.log ?? [], [statusQuery.data]);
  const sendMutation = useMutation({
    mutationFn: () => sendPlayerAction(gameStateId, { characterId: character.id, action }),
    onSuccess: async () => {
      setAction('');
      await queryClient.invalidateQueries({ queryKey: ['play-status', gameStateId] });
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (action.trim()) {
      sendMutation.mutate();
    }
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Игровой стол</span>
          <h1>{statusQuery.data?.location?.name ?? 'Текущая сцена'}</h1>
          <p>{statusQuery.data?.location?.description ?? 'Описание локации появится из backend play/status.'}</p>
        </div>
        <Link className="secondary-button" to={`/games/${gameStateId}/character`}>Персонажи</Link>
      </header>

      <section className="play-layout">
        <div className="scene-panel panel">
          <h2>Сцена</h2>
          <p className="scene-text">AI-мастер описывает ситуацию, последствия действий, бой, награды и новые события.</p>
          <form className="action-form" onSubmit={submit}>
            <label>Действие игрока</label>
            <textarea value={action} onChange={(event) => setAction(event.target.value)} />
            <button className="primary-button" disabled={sendMutation.isPending}>Отправить мастеру</button>
          </form>
        </div>

        <aside className="panel character-panel">
          <h2>{character.name ?? 'Герой'}</h2>
          <p className="muted">{character.className ?? 'Класс'} · уровень {character.level ?? 1}</p>
          <div className="stat-grid">
            <div><strong>{character.hitPoints ?? '-'}</strong><span>HP</span></div>
            <div><strong>{character.maxHitPoints ?? '-'}</strong><span>Max HP</span></div>
            <div><strong>{character.experience ?? 0}</strong><span>XP</span></div>
            <div><strong>{character.gold ?? 0}</strong><span>Gold</span></div>
          </div>
        </aside>
      </section>

      <section className="panel journal-panel">
        <h2>Журнал</h2>
        {statusQuery.isLoading && <p className="muted">Загрузка...</p>}
        {statusQuery.isError && <div className="error-box">Ошибка загрузки /api/play/{gameStateId}/status.</div>}
        <div className="journal-list">
          {entries.map((entry, index) => (
            <article className="journal-entry" key={entry.id ?? index}>
              <small>{entry.type ?? entry.source ?? 'event'}</small>
              <p>{entry.message ?? entry.text ?? 'Событие без текста'}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
