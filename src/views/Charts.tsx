import React, { useState } from 'react';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import ExpenseTrendChart from '../components/dashboard/ExpenseTrendChart';
import ChartSelector, { ChartViewType } from '../components/dashboard/ChartSelector';
import Select from '../components/ui/Select';

const Charts: React.FC = () => {
  const [chartType, setChartType] = useState<ChartViewType>('pie');
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const handleChartTypeChange = (type: ChartViewType) => {
    setChartType(type);
  };

  const handlePeriodChange = (value: string) => {
    setTrendPeriod(value as 'daily' | 'weekly' | 'monthly');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gráficos</h1>
        <p className="text-gray-500">Visualización gráfica de tus gastos</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Distribución de Gastos</h2>
          <ChartSelector activeView={chartType} onChange={handleChartTypeChange} />
        </div>
        {chartType === 'line' ? (
          <ExpenseTrendChart period={trendPeriod} />
        ) : (
          <ExpenseChart chartType={chartType === 'pie' ? 'pie' : 'bar'} />
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Evolución Temporal</h2>
          <div className="w-48">
            <Select
              options={[
                { value: 'daily', label: 'Diario' },
                { value: 'weekly', label: 'Semanal' },
                { value: 'monthly', label: 'Mensual' }
              ]}
              value={trendPeriod}
              onChange={handlePeriodChange}
            />
          </div>
        </div>
        <ExpenseTrendChart period={trendPeriod} />
      </div>
    </div>
  );
};

export default Charts;
