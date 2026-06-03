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

type PlayTab = 'journal' | 'inventory' | 'progress';

export function PlayPage() {
  const { gameStateId = '' } = useParams();
  const queryClient = useQueryClient();
  const [action, setAction] = useState(quickActions[0]);
  const [activeTab, setActiveTab] = useState<PlayTab>('journal');
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

      <section className="panel play-tabs-panel">
        <div className="tab-list">
          <button className={activeTab === 'journal' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('journal')}>Журнал</button>
          <button className={activeTab === 'inventory' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('inventory')}>Инвентарь</button>
          <button className={activeTab === 'progress' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('progress')}>Прогресс</button>
        </div>

        {activeTab === 'journal' && (
          <div className="journal-panel">
            {statusQuery.isLoading && <div className="info-box">Загружаю сцену...</div>}
            {statusQuery.isError && <div className="error-box">Ошибка загрузки play/status.</div>}
            {!statusQuery.isLoading && entries.length === 0 && (
              <div className="empty-state"><div className="empty-state-icon">✦</div><h3>Журнал пуст</h3><p>Отправь первое действие мастеру.</p></div>
            )}
            <div className="journal-list chat-list">
              {entries.map((entry, index) => (
                <article className="journal-entry chat-entry" key={entry.id ?? index}>
                  <small>{entry.type ?? entry.source ?? 'master'}</small>
                  <p>{entry.message ?? entry.text ?? 'Событие без текста'}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            {inventory.length === 0 && <div className="empty-state"><div className="empty-state-icon">◇</div><h3>Инвентарь пуст</h3><p>Предметы появятся после наград, покупок или находок.</p></div>}
            <div className="inventory-list">
              {inventory.map((item, index) => (
                <article className="inventory-item" key={item.id ?? index}>
                  <strong>{item.name}</strong>
                  <span>×{item.quantity ?? 1}</span>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-details">
            <div className="diagnostic-row"><span>Уровень</span><strong>{character?.level ?? 1}</strong></div>
            <div className="diagnostic-row"><span>Опыт</span><strong>{xp} / {xpNext}</strong></div>
            <div className="diagnostic-row"><span>Бонус мастерства</span><strong>+{character?.proficiencyBonus ?? 2}</strong></div>
            <div className="diagnostic-row"><span>Повышение уровня</span><strong>{character?.levelUpAvailable ? 'доступно' : 'недоступно'}</strong></div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
