import { Category, Expense } from '../types';
import { generateId } from '../utils/helpers';

export const initialCategories: Category[] = [
  { id: generateId(), name: 'Gastos Comunidad Casa', color: '#10B981', icon: 'home' },
  { id: generateId(), name: 'Extras Comunidad Casa', color: '#F59E0B', icon: 'plus-circle' },
  { id: generateId(), name: 'Deuda Comunidad Casa', color: '#EF4444', icon: 'alert-circle' },
  { id: generateId(), name: 'Gastos Comunidad Garaje', color: '#3B82F6', icon: 'parking-circle' },
  { id: generateId(), name: 'Extras Garaje', color: '#8B5CF6', icon: 'plus-circle' },
  { id: generateId(), name: 'Deuda Garaje', color: '#EC4899', icon: 'alert-circle' },
];

export const initialExpenses: Expense[] = [];