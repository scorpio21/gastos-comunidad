import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useExpense } from '../../context/ExpenseContext';
import Card, { CardContent } from '../ui/Card';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ExpenseTrendChartProps {
  title?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

const ExpenseTrendChart: React.FC<ExpenseTrendChartProps> = ({ 
  title = 'Evolución de Gastos',
  period = 'monthly'
}) => {
  const { expenses } = useExpense();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (expenses.length === 0) return;

    // Group expenses by time period
    const expensesByPeriod = expenses.reduce((acc: Record<string, { expenses: number; income: number }>, expense) => {
      const date = new Date(expense.date);
      let periodKey: string;
      
      if (period === 'daily') {
        periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (period === 'weekly') {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        periodKey = `${date.getFullYear()}-W${weekNumber}`;
      } else {
        // Monthly
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!acc[periodKey]) {
        acc[periodKey] = { expenses: 0, income: 0 };
      }
      
      if (expense.isIncome) {
        acc[periodKey].income += Math.abs(expense.amount);
      } else {
        acc[periodKey].expenses += Math.abs(expense.amount);
      }
      
      return acc;
    }, {});

    // Sort periods chronologically
    const sortedPeriods = Object.keys(expensesByPeriod).sort();
    
    // Format labels based on period
    const formattedLabels = sortedPeriods.map(periodKey => {
      if (period === 'daily') {
        return new Date(periodKey).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      } else if (period === 'weekly') {
        const [year, week] = periodKey.split('-W');
        return `S${week} ${year}`;
      } else {
        const [year, month] = periodKey.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      }
    });

    const expenseData = sortedPeriods.map(period => expensesByPeriod[period].expenses);
    const incomeData = sortedPeriods.map(period => expensesByPeriod[period].income);

    setChartData({
      labels: formattedLabels,
      datasets: [
        {
          label: 'Gastos',
          data: expenseData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.3,
        },
        {
          label: 'Ingresos',
          data: incomeData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.3,
        }
      ],
    });
  }, [expenses, period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        {expenses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay datos para mostrar</div>
        ) : (
          <div className="h-72">
            <Line data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseTrendChart;
