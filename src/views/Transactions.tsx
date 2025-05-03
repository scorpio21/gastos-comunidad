import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import ExpenseList from '../components/expenses/ExpenseList';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useExpense } from '../context/ExpenseContext';
import { FilterOptions } from '../types';

const Transactions: React.FC = () => {
  const { filterOptions, updateFilterOptions, categories } = useExpense();
  const [showFilters, setShowFilters] = useState(false);
  const [filterForm, setFilterForm] = useState<FilterOptions>({
    ...filterOptions
  });
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters) {
      // Reset filter form when opening
      setFilterForm({...filterOptions});
    }
  };
  
  // Input change handler is now only used for specific input types
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFilterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value
      }
    }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFilterForm(prev => {
      let updatedCategories = [...prev.categories];
      
      if (checked) {
        updatedCategories.push(value);
      } else {
        updatedCategories = updatedCategories.filter(cat => cat !== value);
      }
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };
  
  const applyFilters = () => {
    updateFilterOptions(filterForm);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    const resetOptions: FilterOptions = {
      dateRange: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      categories: [],
      type: 'all'
    };
    
    setFilterForm(resetOptions);
    updateFilterOptions(resetOptions);
  };
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
          <p className="text-gray-500">Ver y gestionar tus transacciones</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            icon={showFilters ? <X size={16} /> : <Filter size={16} />}
            onClick={toggleFilters}
          >
            {showFilters ? 'Close' : 'Filter'}
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    name="startDate"
                    value={filterForm.dateRange.startDate}
                    onChange={handleDateChange}
                    fullWidth
                  />
                  <span className="text-gray-500">hasta</span>
                  <Input
                    type="date"
                    name="endDate"
                    value={filterForm.dateRange.endDate}
                    onChange={handleDateChange}
                    fullWidth
                  />
                </div>
              </div>
              
              <div>
                <Select
                  label="Tipo de Transacción"
                  name="type"
                  options={[
                    { value: 'all', label: 'Todas las Transacciones' },
                    { value: 'expense', label: 'Solo Gastos' },
                    { value: 'income', label: 'Solo Ingresos' }
                  ]}
                  value={filterForm.type}
                  onChange={handleSelectChange('type')}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorías
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        value={category.name}
                        checked={filterForm.categories.includes(category.name)}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`cat-${category.id}`} className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Restablecer
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <ExpenseList title="Todas las Transacciones" />
    </div>
  );
};

export default Transactions;