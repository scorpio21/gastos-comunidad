import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface ExpenseListProps {
  title?: string;
  limit?: number;
  showHeader?: boolean;
}

// Este componente es una versión especial de ExpenseList sin botones de editar y borrar
const PublicExpenseList: React.FC<ExpenseListProps> = ({
  title = 'Transacciones Recientes',
  limit,
  showHeader = true 
}) => {
  const { expenses, categories } = useExpense();
  
  // Get the filtered and sorted expenses
  const filteredExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#64748B';
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <h2 className="text-xl font-bold">{title}</h2>
        </CardHeader>
      )}
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay transacciones registradas.</p>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map(expense => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expense.isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                      {expense.isIncome ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{expense.description}</h3>
                    <div className="flex items-center mt-1">
                      <Badge 
                        color={getCategoryColor(expense.category)}
                        className="mr-2"
                      >
                        {expense.category}
                      </Badge>
                      <div className="flex items-center ml-2 text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className={`text-base font-medium mr-4 ${expense.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {expense.isIncome ? '+' : '-'}{formatCurrency(Math.abs(expense.amount))}
                  </p>
                  {/* Sin botones de editar y borrar */}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicExpenseList;
