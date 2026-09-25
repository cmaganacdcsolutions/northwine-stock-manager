import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, EyeOff, Info, Lock, User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { DEMO_CREDENTIALS } from '../../auth/demoCredentials';
import { Button } from '../../components/atoms/Button/Button';
import { WordmarkLogo } from '../../components/atoms/WordmarkLogo/WordmarkLogo';
import inputStyles from '../../components/atoms/inputs.module.css';
import { FormField } from '../../components/molecules/FormField/FormField';
import styles from './LoginPage.module.css';

interface LocationState {
  from?: { pathname: string };
}

// Demo-only lockout policy: after this many consecutive failures, hold the
// form for a short cooldown so the "bloqueo tras intentos fallidos" state
// from STOCK_MANAGER_SPEC.md §1 is demoable end-to-end (real threshold/backoff
// is a [PLACEHOLDER] per the spec — tuned here for a live walkthrough, not
// production security).
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 15;

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showForgotHint, setShowForgotHint] = useState(false);

  if (isAuthenticated) {
    const state = location.state as LocationState | null;
    return <Navigate to={state?.from?.pathname ?? '/sucursales'} replace />;
  }

  const isLocked = lockedUntil !== null && secondsLeft > 0;

  function tickLockout(until: number) {
    const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining <= 0) {
      setLockedUntil(null);
      setFailedAttempts(0);
      return;
    }
    window.setTimeout(() => tickLockout(until), 1000);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLocked) return;
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Ingresá usuario y contraseña.');
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const ok = login(username.trim(), password);
      setSubmitting(false);
      if (!ok) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_SECONDS * 1000;
          setLockedUntil(until);
          setError(null);
          tickLockout(until);
        } else {
          setError('Usuario o contraseña incorrectos.');
        }
        return;
      }
      navigate('/sucursales', { replace: true });
    }, 250);
  }

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.brandBlock}>
          <WordmarkLogo className={styles.brandMark} />
          <span className={styles.brandKicker}>Stock Manager</span>
          <h1 className={styles.brandTitle}>North Wine</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {isLocked ? (
            <p className={styles.lockout} role="alert">
              <AlertTriangle size={16} aria-hidden="true" />
              Demasiados intentos. Probá de nuevo en {secondsLeft}s.
            </p>
          ) : error ? (
            <p className={styles.error} role="alert">
              <AlertTriangle size={16} aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <FormField label="Usuario" htmlFor="username">
            <div className={inputStyles.inputGroup}>
              <User size={16} aria-hidden="true" className={styles.fieldIcon} />
              <input
                id="username"
                name="username"
                autoComplete="username"
                className={styles.bareInput}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isLocked}
                aria-invalid={Boolean(error)}
              />
            </div>
          </FormField>

          <FormField label="Contraseña" htmlFor="password">
            <div className={inputStyles.inputGroup}>
              <Lock size={16} aria-hidden="true" className={styles.fieldIcon} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={styles.bareInput}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLocked}
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <div className={styles.formRow}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                disabled={isLocked}
              />
              Recordarme
            </label>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => setShowForgotHint((prev) => !prev)}
              aria-expanded={showForgotHint}
            >
              Olvidé mi contraseña
            </button>
          </div>

          {showForgotHint ? (
            <p className={styles.hintBanner}>
              <Info size={14} aria-hidden="true" />
              Contactá a tu administrador de sucursal para restablecerla.
            </p>
          ) : null}

          <Button type="submit" disabled={submitting || isLocked} className={styles.submit}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className={styles.hint}>
          Credenciales demo: <strong>{DEMO_CREDENTIALS.username}</strong> /{' '}
          <strong>{DEMO_CREDENTIALS.password}</strong>
        </p>
      </div>
    </div>
  );
}
