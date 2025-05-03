import React, { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useExpense } from '../../context/ExpenseContext';
import { Expense } from '../../types';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  expense, 
  onSubmit,
  onCancel
}) => {
  const { categories, addExpense, updateExpense } = useExpense();
  const isEditing = !!expense;

  const [formData, setFormData] = useState({
    amount: expense ? Math.abs(expense.amount).toString() : '',
    description: expense?.description || '',
    category: expense?.category || (categories.length > 0 ? categories[0].name : ''),
    date: expense ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo de importe
    if (name === 'amount') {
      // Reemplazar comas por puntos para manejar formato europeo
      let processedValue = value.replace(/,/g, '.');
      
      // Permitir solo números y punto decimal
      const numericValue = processedValue.replace(/[^0-9.]/g, '');
      
      // Evitar múltiples puntos decimales
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts.slice(1).join('')}` 
        : numericValue;
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount) {
      newErrors.amount = 'El importe es obligatorio';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'El importe debe ser un número positivo';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Asegurarse de que el importe sea un número válido
    // Reemplazar comas por puntos para asegurar el formato correcto
    const sanitizedAmount = formData.amount.replace(/,/g, '.');
    const amount = parseFloat(sanitizedAmount);
    if (isNaN(amount)) {
      setErrors(prev => ({ ...prev, amount: 'El importe debe ser un número válido' }));
      return;
    }
    
    const expenseData = {
      amount: amount, // Usar parseFloat en lugar de Number para mejor manejo de decimales
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      isIncome: false
    };
    
    try {
      if (isEditing && expense) {
        updateExpense({ ...expenseData, id: expense.id });
      } else {
        addExpense(expenseData);
      }
      
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
      alert('Hubo un error al guardar el gasto. Por favor, inténtalo de nuevo.');
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category.name,
    label: category.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Importe"
          type="text"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleInputChange}
          error={errors.amount}
          fullWidth
          placeholder="0.00"
          inputMode="decimal"
          pattern="[0-9]*(\.[0-9]+)?"
        />

        <Input
          label="Fecha"
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleInputChange}
          error={errors.date}
          fullWidth
          icon={<Calendar size={16} />}
        />
      </div>

      <Select
        label="Categoría"
        name="category"
        id="category"
        options={categoryOptions}
        value={formData.category}
        onChange={handleSelectChange('category')}
        error={errors.category}
        fullWidth
      />

      <Input
        label="Descripción"
        type="text"
        name="description"
        id="description"
        value={formData.description}
        onChange={handleInputChange}
        error={errors.description}
        fullWidth
        placeholder="Descripción del gasto..."
      />

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          icon={<PlusCircle size={18} />}
        >
          {isEditing ? 'Actualizar' : 'Añadir'} Gasto
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;