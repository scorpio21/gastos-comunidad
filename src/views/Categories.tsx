import React from 'react';
import CategoryList from '../components/expenses/CategoryList';

const Categories: React.FC = () => {
  return (
    <div className="space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <p className="text-gray-500">Gestiona tus categorías de gastos</p>
      </div>

      <CategoryList />
    </div>
  );
};

export default Categories;