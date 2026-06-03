export function ErrorState({ title = 'Ошибка', text, onRetry }: { title?: string; text: string; onRetry?: () => void }) {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{text}</p>
      {onRetry && <button className="secondary-button" type="button" onClick={onRetry}>Повторить</button>}
    </div>
  );
}
