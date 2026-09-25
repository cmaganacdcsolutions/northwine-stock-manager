import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>La página que buscás no existe.</p>
      <Link className={styles.link} to="/dashboard">
        Volver al dashboard
      </Link>
    </div>
  );
}
