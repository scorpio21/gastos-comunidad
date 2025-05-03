import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { useExpense } from '../../context/ExpenseContext';
import { getSummaryByCategory, formatCurrency } from '../../utils/helpers';

const CategorySummary: React.FC = () => {
  const { expenses, categories } = useExpense();
  const categorySummary = getSummaryByCategory(expenses, categories);
  
  // Calculate total expenses for percentages
  const totalExpenses = categorySummary.reduce((sum, item) => {
    // Asegurarse de que amount sea un número válido
    const amount = Number(item.amount) || 0;
    return sum + amount;
  }, 0);
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Gastos por Categoría</h2>
      </CardHeader>
      <CardContent>
        {categorySummary.length > 0 ? (
          <div className="space-y-4">
            {categorySummary.map((item, index) => {
              // Asegurarse de que amount sea un número válido
              const amount = Number(item.amount) || 0;
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <p>No hay datos de gastos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySummary;