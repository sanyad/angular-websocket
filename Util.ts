export type MeasurementUnit =
  'Milliliter' |
  'Gram' |
  'Kilogram' |
  'Ounce' |
  'Spoon' |
  'Item' |
  'Package'

export interface PagerEvent {
  page: number;
}

export interface SelectedEvent<T> {
  selected: T[];
}

export interface Identifier {
  id: number;
}

export interface IdName {
  id: number;
  name: string;
}

export interface SelectedIngredient<T> {
  ingredient: T;
  amount: number;
  unit: MeasurementUnit;
}

export interface Paged<T> {
  total: number;
  data: T[];
}

export const Bool = [false, true];
