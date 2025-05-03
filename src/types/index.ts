export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  isIncome: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  dateRange: DateRange;
  categories: string[];
  minAmount?: number;
  maxAmount?: number;
  type: 'all' | 'expense' | 'income';
}