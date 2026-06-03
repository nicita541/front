export function LoadingState({ text = 'Загрузка...' }: { text?: string }) {
  return (
    <div className="loading-state">
      <span className="loader-dot" />
      <span>{text}</span>
    </div>
  );
}
