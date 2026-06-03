import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../shared/api/authApi';

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('test1@example.com');
  const [username, setUsername] = useState('test1');
  const [displayName, setDisplayName] = useState('Test User 1');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, username, displayName, password });
      }
      navigate('/games');
    } catch (err) {
      setError('Не удалось выполнить запрос. Проверь backend, CORS и адрес API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="badge">D&D AI Master</div>
        <h1>Твой браузерный стол для RPG с AI-мастером</h1>
        <p>Frontend под backend: auth, game-states, characters, play/status и игровой журнал.</p>
      </section>

      <form className="panel auth-card" onSubmit={submit}>
        <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        <label>Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} />

        {mode === 'register' && (
          <>
            <label>Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
            <label>Отображаемое имя</label>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </>
        )}

        <label>Пароль</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <div className="error-box">{error}</div>}
        <button className="primary-button" disabled={loading}>{loading ? 'Запрос...' : 'Продолжить'}</button>
        <button className="link-button" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Создать аккаунт' : 'У меня уже есть аккаунт'}
        </button>
      </form>
    </div>
  );
}
