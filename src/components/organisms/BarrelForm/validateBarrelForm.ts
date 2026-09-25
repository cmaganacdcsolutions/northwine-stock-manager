export interface BarrelFormValues {
  code: string;
  wineType: string;
  varietal: string;
  oakType: string;
  capacityLiters: string;
  currentLiters: string;
  fillDate: string;
  status: string;
  notes: string;
}

export type BarrelFormErrors = Partial<Record<keyof BarrelFormValues, string>>;

export function validateBarrelForm(values: BarrelFormValues): BarrelFormErrors {
  const errors: BarrelFormErrors = {};

  if (!values.code.trim()) errors.code = 'El código es obligatorio.';
  if (!values.varietal.trim()) errors.varietal = 'El varietal es obligatorio.';

  const capacity = Number(values.capacityLiters);
  if (!values.capacityLiters || Number.isNaN(capacity) || capacity <= 0) {
    errors.capacityLiters = 'Ingresá una capacidad mayor a 0.';
  }

  const current = Number(values.currentLiters);
  if (values.currentLiters === '' || Number.isNaN(current) || current < 0) {
    errors.currentLiters = 'Ingresá un valor de llenado válido.';
  } else if (!errors.capacityLiters && current > capacity) {
    errors.currentLiters = 'El llenado no puede superar la capacidad.';
  }

  if (!values.fillDate) {
    errors.fillDate = 'La fecha de llenado es obligatoria.';
  } else if (new Date(values.fillDate) > new Date()) {
    errors.fillDate = 'La fecha no puede ser futura.';
  }

  return errors;
}
