import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import styles from './StateView.module.css';
import { Button } from '../../atoms/Button/Button';

interface StateViewProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

/** Shared shell for empty and error states so every list looks consistent. */
function StateView({ icon, title, description, action }: StateViewProps) {
  return (
    <div className={styles.wrapper} role="status">
      <div className={styles.icon}>{icon}</div>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState(props: Omit<StateViewProps, 'icon'> & { icon?: ReactNode }) {
  return <StateView icon={props.icon ?? <Inbox size={28} strokeWidth={1.5} />} {...props} />;
}

export function ErrorState(props: Omit<StateViewProps, 'icon'> & { icon?: ReactNode }) {
  return <StateView icon={props.icon ?? <AlertTriangle size={28} strokeWidth={1.5} />} {...props} />;
}
