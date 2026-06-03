import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { getPlayStatus, sendPlayerAction } from '../shared/api/playApi';

const quickActions = [
  'Осмотреться вокруг и поискать опасность.',
  'Поговорить с ближайшим NPC.',
  'Проверить инвентарь и подготовить снаряжение.',
  'Продвинуться осторожно вперёд.',
];

export function PlayPage() {
  const { gameStateId = '' } = useParams();
  const queryClient = useQueryClient();
  const [action, setAction] = useState(quickActions[0]);
  const statusQuery = useQuery({ queryKey: ['play-status', gameStateId], queryFn: () => getPlayStatus(gameStateId), enabled: Boolean(gameStateId) });
  const character = statusQuery.data?.character;
  const inventory = statusQuery.data?.inventory ?? [];
  const entries = useMemo(() => statusQuery.data?.journal ?? statusQuery.data?.log ?? [], [statusQuery.data]);
  const xp = character?.experience ?? 0;
  const xpNext = character?.experienceToNextLevel ?? 1000;
  const xpPercent = Math.min(100, Math.round((xp / Math.max(xpNext, 1)) * 100));

  const sendMutation = useMutation({
    mutationFn: () => sendPlayerAction(gameStateId, { characterId: character?.id, action }),
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
          <div>
            <h2>Сцена</h2>
            <p className="scene-text">AI-мастер описывает ситуацию, последствия действий, бой, награды и новые события.</p>
            <div className="quick-actions">
              {quickActions.map((item) => (
                <button className="chip-button" key={item} type="button" onClick={() => setAction(item)}>{item}</button>
              ))}
            </div>
          </div>
          <form className="action-form" onSubmit={submit}>
            <label>Действие игрока</label>
            <textarea value={action} onChange={(event) => setAction(event.target.value)} />
            <button className="primary-button" disabled={sendMutation.isPending || !action.trim()}>
              {sendMutation.isPending ? 'Мастер думает...' : 'Отправить мастеру'}
            </button>
          </form>
        </div>

        <aside className="panel character-panel">
          <h2>{character?.name ?? 'Герой не выбран'}</h2>
          <p className="muted">{character?.className ?? 'Класс'} · уровень {character?.level ?? 1} · PB +{character?.proficiencyBonus ?? 2}</p>
          <div className="stat-grid">
            <div><strong>{character?.hitPoints ?? '-'}</strong><span>HP</span></div>
            <div><strong>{character?.maxHitPoints ?? '-'}</strong><span>Max HP</span></div>
            <div><strong>{xp}</strong><span>XP</span></div>
            <div><strong>{character?.gold ?? 0}</strong><span>Gold</span></div>
          </div>
          <div className="progress-block">
            <div className="progress-label"><span>До уровня</span><strong>{xpPercent}%</strong></div>
            <div className="progress-bar"><span style={{ width: `${xpPercent}%` }} /></div>
            {character?.levelUpAvailable && <div className="success-box">Доступно повышение уровня</div>}
          </div>
        </aside>
      </section>

      <section className="grid two-columns bottom-grid">
        <div className="panel journal-panel">
          <h2>Журнал</h2>
          {statusQuery.isLoading && <p className="muted">Загрузка...</p>}
          {statusQuery.isError && <div className="error-box">Ошибка загрузки play/status.</div>}
          {!statusQuery.isLoading && entries.length === 0 && <p className="muted">Событий пока нет. Отправь первое действие мастеру.</p>}
          <div className="journal-list">
            {entries.map((entry, index) => (
              <article className="journal-entry" key={entry.id ?? index}>
                <small>{entry.type ?? entry.source ?? 'event'}</small>
                <p>{entry.message ?? entry.text ?? 'Событие без текста'}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Инвентарь</h2>
          {inventory.length === 0 && <p className="muted">Инвентарь пуст или backend пока не вернул предметы.</p>}
          <div className="inventory-list">
            {inventory.map((item, index) => (
              <article className="inventory-item" key={item.id ?? index}>
                <strong>{item.name}</strong>
                <span>×{item.quantity ?? 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
