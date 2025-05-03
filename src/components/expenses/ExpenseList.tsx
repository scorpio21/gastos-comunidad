import React, { useState } from 'react';
import { Edit, Trash2, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import ExpenseForm from './ExpenseForm';
import { Expense } from '../../types';

interface ExpenseListProps {
  title?: string;
  limit?: number;
  showHeader?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  title = 'Transacciones Recientes', 
  limit,
  showHeader = true 
}) => {
  const { expenses, categories, deleteExpense } = useExpense();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Get the filtered and sorted expenses
  const filteredExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      deleteExpense(id);
    }
  };
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#64748B';
  };

  if (editingExpense) {
    return (
      <Card>
        <CardContent>
          <ExpenseForm 
            expense={editingExpense} 
            onSubmit={() => setEditingExpense(null)}
            onCancel={() => setEditingExpense(null)}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </CardHeader>
      )}
      <div className="divide-y divide-gray-100">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}
                  >
                    {expense.isIncome ? (
                      <ArrowUpRight size={18} color={getCategoryColor(expense.category)} />
                    ) : (
                      <ArrowDownRight size={18} color={getCategoryColor(expense.category)} />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center mt-1">
                    <Badge color={getCategoryColor(expense.category)}>
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
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpenseList;