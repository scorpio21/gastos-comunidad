import React from 'react';
import { Home, ParkingCircle, Download } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/helpers';
import { exportToExcel } from '../../utils/excel';

const FinancialSummary: React.FC = () => {
  const { expenses } = useExpense();
  
  const calculateSummary = () => {
    const summary = {
      casa: {
        gastos: 0,
        extras: 0,
        deuda: 0
      },
      garaje: {
        gastos: 0,
        extras: 0,
        deuda: 0
      }
    };
    
    expenses.forEach(expense => {
      // Asegurarse de que expense.amount sea un número válido
      const amount = Number(expense.amount) || 0;
      
      if (expense.category === 'Gastos Comunidad Casa') {
        summary.casa.gastos += amount;
      } else if (expense.category === 'Extras Comunidad Casa') {
        summary.casa.extras += amount;
      } else if (expense.category === 'Deuda Comunidad Casa') {
        summary.casa.deuda += amount;
      } else if (expense.category === 'Gastos Comunidad Garaje') {
        summary.garaje.gastos += amount;
      } else if (expense.category === 'Extras Garaje') {
        summary.garaje.extras += amount;
      } else if (expense.category === 'Deuda Garaje') {
        summary.garaje.deuda += amount;
      }
    });
    
    return summary;
  };
  
  const summary = calculateSummary();
  
  const calculateTotal = (type: 'casa' | 'garaje') => {
    const data = summary[type];
    // Asegurarse de que todos los valores sean números válidos
    const gastos = Number(data.gastos) || 0;
    const extras = Number(data.extras) || 0;
    const deuda = Number(data.deuda) || 0;
    
    // Calcular el total
    let total = gastos + extras;
    
    // Manejar la deuda
    if (deuda > 0) {
      if (total >= deuda) {
        total -= deuda;
      } else {
        total = 0;
      }
    }
    
    // No modificamos el objeto original para evitar efectos secundarios
    return total;
  };
  
  const casaTotal = calculateTotal('casa');
  const garajeTotal = calculateTotal('garaje');

  const handleExport = () => {
    exportToExcel(expenses);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          icon={<Download size={16} />}
          onClick={handleExport}
        >
          Exportar a Excel
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-teal-50 mr-4">
                <Home size={24} className="text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold">Comunidad Casa</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gastos:</span>
                <span className="font-medium">{formatCurrency(summary.casa.gastos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extras:</span>
                <span className="font-medium">{formatCurrency(summary.casa.extras)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deuda:</span>
                <span className="font-medium text-red-600">{formatCurrency(summary.casa.deuda)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-teal-600">{formatCurrency(casaTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-50 mr-4">
                <ParkingCircle size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Comunidad Garaje</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gastos:</span>
                <span className="font-medium">{formatCurrency(summary.garaje.gastos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extras:</span>
                <span className="font-medium">{formatCurrency(summary.garaje.extras)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deuda:</span>
                <span className="font-medium text-red-600">{formatCurrency(summary.garaje.deuda)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(garajeTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSummary;