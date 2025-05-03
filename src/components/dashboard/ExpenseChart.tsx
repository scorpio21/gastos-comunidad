import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useExpense } from '../../context/ExpenseContext';
import Card, { CardContent } from '../ui/Card';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

type ChartType = 'pie' | 'bar';

interface ExpenseChartProps {
  chartType?: ChartType;
  title?: string;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ 
  chartType = 'pie',
  title = 'Gastos por Categoría'
}) => {
  const { expenses, categories } = useExpense();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (expenses.length === 0) return;

    // Group expenses by category and calculate totals
    const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
      // Only include expenses (not income)
      if (expense.isIncome) return acc;
      
      const { category } = expense;
      // Asegurarse de que amount sea un número válido
      const amount = Number(expense.amount) || 0;
      acc[category] = (acc[category] || 0) + Math.abs(amount);
      return acc;
    }, {});

    // Get category colors from the categories array
    const categoryColors = categories.reduce((acc: Record<string, string>, category) => {
      acc[category.name] = category.color;
      return acc;
    }, {});

    // Sort categories by amount (descending)
    const sortedCategories = Object.keys(expensesByCategory).sort(
      (a, b) => expensesByCategory[b] - expensesByCategory[a]
    );

    const labels = sortedCategories;
    const data = sortedCategories.map(category => expensesByCategory[category]);
    const backgroundColor = sortedCategories.map(
      category => categoryColors[category] || '#' + Math.floor(Math.random()*16777215).toString(16)
    );
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => color),
          borderWidth: 1,
        },
      ],
    });
  }, [expenses, categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
    },
  };

  const barOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    if (expenses.length === 0) {
      return <div className="text-center text-gray-500 py-10">No hay datos para mostrar</div>;
    }

    if (chartType === 'pie') {
      return (
        <div className="h-72">
          <Pie data={chartData} options={options} />
        </div>
      );
    }

    return (
      <div className="h-72">
        <Bar data={chartData} options={barOptions} />
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
