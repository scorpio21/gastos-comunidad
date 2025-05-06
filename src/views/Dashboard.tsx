import React from 'react';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import CategorySummary from '../components/dashboard/CategorySummary';
import PersonalDebtBars from '../components/dashboard/PersonalDebtBars';
import PublicExpenseList from '../components/expenses/PublicExpenseList';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
        <p className="text-gray-500">Resumen de tus finanzas</p>
      </div>

      <FinancialSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PublicExpenseList limit={5} />
        </div>
        <div>
          <CategorySummary />
          <PersonalDebtBars />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;