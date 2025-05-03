/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

/**
 * Format a date in the local format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Get total income, expenses and balance from a list of transactions
 */
export const getFinancialSummary = (expenses: any[]) => {
  const income = expenses
    .filter(expense => expense.isIncome)
    .reduce((acc, expense) => acc + expense.amount, 0);
  
  const outcome = expenses
    .filter(expense => !expense.isIncome)
    .reduce((acc, expense) => acc + expense.amount, 0);
  
  return {
    income,
    outcome,
    balance: income - outcome
  };
};

/**
 * Group expenses by category
 */
export const groupByCategory = (expenses: any[]) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {});
};

/**
 * Get summary by category
 */
export const getSummaryByCategory = (expenses: any[], categories: any[]) => {
  const categorySummary = expenses.reduce((acc, expense) => {
    if (!expense.isIncome) {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      // Asegurarse de que amount sea un número válido
      const amount = Number(expense.amount) || 0;
      acc[category] += amount;
    }
    return acc;
  }, {});

  return Object.keys(categorySummary).map(category => {
    const categoryObj = categories.find(c => c.name === category);
    // Asegurarse de que el amount sea un número válido
    const amount = Number(categorySummary[category]) || 0;
    return {
      name: category,
      amount: amount,
      color: categoryObj?.color || '#64748B'
    };
  }).sort((a, b) => b.amount - a.amount);
};

/**
 * Filter expenses based on filter options
 */
export const filterExpenses = (expenses: any[], filterOptions: any) => {
  const { dateRange, categories, minAmount, maxAmount, type } = filterOptions;
  
  return expenses.filter(expense => {
    // Filter by date range
    const expenseDate = new Date(expense.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    if (expenseDate < startDate || expenseDate > endDate) {
      return false;
    }
    
    // Filter by categories
    if (categories.length > 0 && !categories.includes(expense.category)) {
      return false;
    }
    
    // Filter by amount
    if (minAmount !== undefined && expense.amount < minAmount) {
      return false;
    }
    
    if (maxAmount !== undefined && expense.amount > maxAmount) {
      return false;
    }
    
    // Filter by type
    if (type === 'expense' && expense.isIncome) {
      return false;
    }
    
    if (type === 'income' && !expense.isIncome) {
      return false;
    }
    
    return true;
  });
};