import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Category, FilterOptions, DateRange } from '../types';
import { categoryApi, expenseApi, testApiConnection } from '../utils/api';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateFilterOptions: (options: Partial<FilterOptions>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Get first day of current month
const getFirstDayOfMonth = (): string => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

// Get today with time set to end of day
const getEndOfToday = (): string => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const defaultDateRange: DateRange = {
  startDate: getFirstDayOfMonth(),
  endDate: getEndOfToday()
};

const defaultFilterOptions: FilterOptions = {
  dateRange: defaultDateRange,
  categories: [],
  type: 'all'
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Primero verificar la conexión con la API
        const isConnected = await testApiConnection();
        if (!isConnected) {
          throw new Error('No se pudo conectar con la API. Verifica que XAMPP esté en ejecución y que la ruta de la API sea correcta.');
        }
        
        // Cargar categorías
        const categoriesData = await categoryApi.getAll();
        setCategories(categoriesData);
        
        // Cargar gastos con los filtros actuales
        await loadExpenses();
      } catch (err: any) {
        console.error('Error al cargar datos iniciales:', err);
        setError(err.message || 'Error al cargar datos. Verifica que XAMPP esté en ejecución y que la base de datos esté configurada correctamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Cargar gastos cuando cambian los filtros
  useEffect(() => {
    if (!isLoading) {
      loadExpenses();
    }
  }, [filterOptions]);

  // Función para cargar gastos según los filtros actuales
  const loadExpenses = async () => {
    try {
      const { dateRange, categories: categoryFilters, type } = filterOptions;
      
      const filters = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type
      };
      
      const expensesData = await expenseApi.getAll(filters);
      
      // Filtrar por categorías si es necesario
      let filteredExpenses = expensesData;
      if (categoryFilters && categoryFilters.length > 0) {
        filteredExpenses = expensesData.filter(expense => 
          categoryFilters.includes(expense.category)
        );
      }
      
      setExpenses(filteredExpenses);
    } catch (err) {
      console.error('Error al cargar gastos:', err);
      setError('Error al cargar gastos. Por favor, intenta de nuevo.');
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const result = await expenseApi.create(expenseData);
      const newExpense: Expense = {
        ...expenseData,
        id: result.id
      };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    } catch (err) {
      console.error('Error al añadir gasto:', err);
      setError('Error al añadir gasto. Por favor, intenta de nuevo.');
    }
  };
  
  const updateExpense = async (updatedExpense: Expense) => {
    try {
      await expenseApi.update(updatedExpense);
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    } catch (err) {
      console.error('Error al actualizar gasto:', err);
      setError('Error al actualizar gasto. Por favor, intenta de nuevo.');
    }
  };
  
  const deleteExpense = async (id: string) => {
    try {
      await expenseApi.delete(id);
      setExpenses(prevExpenses => 
        prevExpenses.filter(expense => expense.id !== id)
      );
    } catch (err) {
      console.error('Error al eliminar gasto:', err);
      setError('Error al eliminar gasto. Por favor, intenta de nuevo.');
    }
  };
  
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const result = await categoryApi.create(categoryData);
      const newCategory: Category = {
        ...categoryData,
        id: result.id
      };
      setCategories(prevCategories => [...prevCategories, newCategory]);
    } catch (err) {
      console.error('Error al añadir categoría:', err);
      setError('Error al añadir categoría. Por favor, intenta de nuevo.');
    }
  };
  
  const updateCategory = async (updatedCategory: Category) => {
    try {
      await categoryApi.update(updatedCategory);
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
    } catch (err) {
      console.error('Error al actualizar categoría:', err);
      setError('Error al actualizar categoría. Por favor, intenta de nuevo.');
    }
  };
  
  const deleteCategory = async (id: string) => {
    try {
      // La validación de si la categoría está en uso se hace en el backend
      await categoryApi.delete(id);
      setCategories(prevCategories => 
        prevCategories.filter(category => category.id !== id)
      );
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert('No se puede eliminar la categoría. Puede que esté siendo utilizada por gastos existentes.');
    }
  };
  
  const updateFilterOptions = (options: Partial<FilterOptions>) => {
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      ...options
    }));
  };
  
  const value = {
    expenses,
    categories,
    filterOptions,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    updateFilterOptions
  };
  
  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};