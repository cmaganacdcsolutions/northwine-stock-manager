import { useState, type FormEvent } from 'react';
import type { MovementType, WineVintage } from '../../../data/types';
import { FormField } from '../../molecules/FormField/FormField';
import { Button } from '../../atoms/Button/Button';
import inputStyles from '../../atoms/inputs.module.css';
import { formatNumber } from '../../../lib/format';
import styles from './StockAdjustmentForm.module.css';

interface StockAdjustmentFormProps {
  vintage: WineVintage;
  wineName: string;
  onSubmit: (input: { type: MovementType; quantity: number; reason: string }) => void;
  onCancel: () => void;
}

export function StockAdjustmentForm({ vintage, wineName, onSubmit, onCancel }: StockAdjustmentFormProps) {
  const [type, setType] = useState<MovementType>('entrada');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const qty = Number(quantity);

    if (!quantity || Number.isNaN(qty) || qty <= 0) {
      setError('Ingresá una cantidad mayor a 0.');
      return;
    }
    if (type === 'salida' && qty > vintage.stockBottles) {
      setError(`No hay suficiente stock. Disponible: ${formatNumber(vintage.stockBottles)}.`);
      return;
    }
    if (!reason.trim()) {
      setError('Ingresá un motivo para el movimiento.');
      return;
    }

    setError(null);
    onSubmit({ type, quantity: qty, reason: reason.trim() });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.context}>
        {wineName} — stock actual: <strong>{formatNumber(vintage.stockBottles)}</strong> botellas
      </p>

      <div className={styles.typeToggle} role="radiogroup" aria-label="Tipo de movimiento">
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'entrada' ? styles.active : ''}`}
          role="radio"
          aria-checked={type === 'entrada'}
          onClick={() => setType('entrada')}
        >
          Entrada
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'salida' ? styles.active : ''}`}
          role="radio"
          aria-checked={type === 'salida'}
          onClick={() => setType('salida')}
        >
          Salida
        </button>
      </div>

      <FormField label="Cantidad (botellas)" htmlFor="quantity">
        <input
          id="quantity"
          type="number"
          min={1}
          className={inputStyles.input}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </FormField>

      <FormField label="Motivo" htmlFor="reason" hint="Ej: venta a distribuidor, ajuste de inventario, traslado.">
        <input
          id="reason"
          className={inputStyles.input}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </FormField>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Registrar movimiento</Button>
      </div>
    </form>
  );
}
