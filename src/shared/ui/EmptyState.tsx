import type { ReactNode } from 'react';

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">✦</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
