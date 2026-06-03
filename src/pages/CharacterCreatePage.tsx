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
    mutationFn: () => createCharacter(gameStateId, { name, className, background }),
    onSuccess: () => navigate(`/play/${gameStateId}`),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
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
          <button className="primary-button" disabled={createMutation.isPending}>Создать и играть</button>
        </form>
        <div className="panel">
          <h2>Персонажи игры</h2>
          {charactersQuery.isLoading && <p className="muted">Загрузка...</p>}
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
