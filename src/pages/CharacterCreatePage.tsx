import { FormEvent, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../widgets/AppShell';
import { createCharacter, getCharacters } from '../shared/api/gameApi';

export function CharacterCreatePage() {
  const { gameStateId = '' } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('Торвен');
  const [className, setClassName] = useState('Воин');
  const [background, setBackground] = useState('Бывший стражник пограничной заставы.');
  const charactersQuery = useQuery({ queryKey: ['characters', gameStateId], queryFn: () => getCharacters(gameStateId), enabled: Boolean(gameStateId) });
  const createMutation = useMutation({
    mutationFn: () => createCharacter(gameStateId, { name: name.trim(), className, background }),
    onSuccess: () => navigate(`/play/${gameStateId}`),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) {
      createMutation.mutate();
    }
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <span className="eyebrow">Персонаж</span>
          <h1>Создание героя</h1>
          <p>Герой создаётся явно для выбранной игры.</p>
        </div>
        <Link className="secondary-button" to={`/play/${gameStateId}`}>К столу</Link>
      </header>
      <section className="grid two-columns">
        <form className="panel" onSubmit={submit}>
          <h2>Новый герой</h2>
          <label>Имя</label>
          <input value={name} onChange={(event) => setName(event.target.value)} />
          <label>Класс</label>
          <select value={className} onChange={(event) => setClassName(event.target.value)}>
            <option>Воин</option>
            <option>Следопыт</option>
            <option>Маг</option>
            <option>Плут</option>
            <option>Жрец</option>
          </select>
          <label>История</label>
          <textarea value={background} onChange={(event) => setBackground(event.target.value)} />
          {createMutation.isError && <div className="error-box">Не удалось создать персонажа.</div>}
          <button className="primary-button" disabled={createMutation.isPending || !name.trim()}>
            {createMutation.isPending ? 'Создаю...' : 'Создать и играть'}
          </button>
        </form>
        <div className="panel">
          <h2>Персонажи игры</h2>
          {charactersQuery.isLoading && <div className="info-box">Загружаю персонажей...</div>}
          {charactersQuery.isError && <div className="error-box">Ошибка загрузки персонажей.</div>}
          {charactersQuery.isSuccess && charactersQuery.data.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>Персонажей пока нет</h3>
              <p>Создай первого героя слева, чтобы начать игру.</p>
            </div>
          )}
          {(charactersQuery.data ?? []).map((character) => (
            <article className="game-card" key={character.id}>
              <div>
                <h3>{character.name}</h3>
                <p>{character.className ?? 'Класс не указан'} · уровень {character.level ?? 1}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
