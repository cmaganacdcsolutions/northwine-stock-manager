import type { VintageLabel, WineType } from '../../data/types';

export const VINTAGE_LABEL_TEXT: Record<VintageLabel, string> = {
  reserva_joven: 'Reserva joven',
  '10': '10 años',
  '20': '20 años',
  '25': '25 años',
};

export const WINE_TYPE_TEXT: Record<WineType, string> = {
  tinto: 'Tinto',
  blanco: 'Blanco',
  rosado: 'Rosado',
};
