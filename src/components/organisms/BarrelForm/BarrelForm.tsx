import { useState, type FormEvent } from 'react';
import type { Barrel, BarrelStatus, OakType, WineType } from '../../../data/types';
import { FormField } from '../../molecules/FormField/FormField';
import { Button } from '../../atoms/Button/Button';
import inputStyles from '../../atoms/inputs.module.css';
import { WINE_TYPE_LABEL, OAK_TYPE_LABEL, BARREL_STATUS_LABEL } from '../../../pages/BarrelsPage/barrelLabels';
import { validateBarrelForm, type BarrelFormValues } from './validateBarrelForm';
import styles from './BarrelForm.module.css';

interface BarrelFormProps {
  initialValue?: Barrel;
  onSubmit: (values: Omit<Barrel, 'id' | 'branchId'>) => void;
  onCancel: () => void;
}

function toFormValues(barrel?: Barrel): BarrelFormValues {
  return {
    code: barrel?.code ?? '',
    wineType: barrel?.wineType ?? 'tinto',
    varietal: barrel?.varietal ?? '',
    oakType: barrel?.oakType ?? 'frances',
    capacityLiters: barrel ? String(barrel.capacityLiters) : '225',
    currentLiters: barrel ? String(barrel.currentLiters) : '',
    fillDate: barrel?.fillDate ?? '',
    status: barrel?.status ?? 'añejando',
    notes: barrel?.notes ?? '',
  };
}

export function BarrelForm({ initialValue, onSubmit, onCancel }: BarrelFormProps) {
  const [values, setValues] = useState<BarrelFormValues>(() => toFormValues(initialValue));
  const [errors, setErrors] = useState<ReturnType<typeof validateBarrelForm>>({});

  function update<K extends keyof BarrelFormValues>(key: K, value: BarrelFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateBarrelForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      code: values.code.trim(),
      wineType: values.wineType as WineType,
      varietal: values.varietal.trim(),
      oakType: values.oakType as OakType,
      capacityLiters: Number(values.capacityLiters),
      currentLiters: Number(values.currentLiters),
      fillDate: values.fillDate,
      status: values.status as BarrelStatus,
      notes: values.notes.trim() || undefined,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <FormField label="Código" htmlFor="code" error={errors.code}>
          <input
            id="code"
            className={inputStyles.input}
            value={values.code}
            onChange={(event) => update('code', event.target.value)}
          />
        </FormField>

        <FormField label="Estado" htmlFor="status">
          <select
            id="status"
            className={inputStyles.select}
            value={values.status}
            onChange={(event) => update('status', event.target.value)}
          >
            {(Object.keys(BARREL_STATUS_LABEL) as BarrelStatus[]).map((status) => (
              <option key={status} value={status}>
                {BARREL_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Tipo de vino" htmlFor="wineType">
          <select
            id="wineType"
            className={inputStyles.select}
            value={values.wineType}
            onChange={(event) => update('wineType', event.target.value)}
          >
            {(Object.keys(WINE_TYPE_LABEL) as WineType[]).map((type) => (
              <option key={type} value={type}>
                {WINE_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Varietal" htmlFor="varietal" error={errors.varietal}>
          <input
            id="varietal"
            className={inputStyles.input}
            value={values.varietal}
            onChange={(event) => update('varietal', event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Tipo de roble" htmlFor="oakType">
        <select
          id="oakType"
          className={inputStyles.select}
          value={values.oakType}
          onChange={(event) => update('oakType', event.target.value)}
        >
          {(Object.keys(OAK_TYPE_LABEL) as OakType[]).map((oak) => (
            <option key={oak} value={oak}>
              {OAK_TYPE_LABEL[oak]}
            </option>
          ))}
        </select>
      </FormField>

      <div className={styles.row}>
        <FormField label="Capacidad (L)" htmlFor="capacityLiters" error={errors.capacityLiters}>
          <input
            id="capacityLiters"
            type="number"
            min={0}
            className={inputStyles.input}
            value={values.capacityLiters}
            onChange={(event) => update('capacityLiters', event.target.value)}
          />
        </FormField>

        <FormField label="Llenado actual (L)" htmlFor="currentLiters" error={errors.currentLiters}>
          <input
            id="currentLiters"
            type="number"
            min={0}
            className={inputStyles.input}
            value={values.currentLiters}
            onChange={(event) => update('currentLiters', event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Fecha de llenado" htmlFor="fillDate" error={errors.fillDate}>
        <input
          id="fillDate"
          type="date"
          className={inputStyles.input}
          value={values.fillDate}
          onChange={(event) => update('fillDate', event.target.value)}
        />
      </FormField>

      <FormField label="Notas (opcional)" htmlFor="notes">
        <textarea
          id="notes"
          className={inputStyles.textarea}
          value={values.notes}
          onChange={(event) => update('notes', event.target.value)}
        />
      </FormField>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialValue ? 'Guardar cambios' : 'Crear barril'}</Button>
      </div>
    </form>
  );
}
