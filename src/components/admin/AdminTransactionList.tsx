import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownRight, Edit, Trash2 } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface AdminTransactionListProps {
  title?: string;
  limit?: number;
  showHeader?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Componente que muestra una lista de transacciones con botones de editar/borrar
 * exclusivamente para administradores
 */
const AdminTransactionList: React.FC<AdminTransactionListProps> = ({ 
  title = 'Administrar Transacciones', 
  limit,
  showHeader = true,
  onEdit,
  onDelete
}) => {
  const { expenses, categories, deleteExpense } = useExpense();
  
  // Obtener las transacciones filtradas y ordenadas
  const filteredExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#64748B';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteExpense(id);
      }
    }
  };
  
  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </CardHeader>
      )}
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No hay transacciones registradas.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors duration-150">
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
                  
                  {/* Botones de administración - solo visibles para administradores */}
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit && onEdit(expense.id)}
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTransactionList;
