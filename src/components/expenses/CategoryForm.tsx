import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useExpense } from '../../context/ExpenseContext';
import { Category } from '../../types';

interface CategoryFormProps {
  category?: Category | null;
  onSubmit?: () => void;
  onCancel?: () => void;
}

// Predefined colors for categories
const predefinedColors = [
  '#10B981', // Green
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#64748B', // Slate
  '#0D9488', // Teal
  '#F97316', // Orange
];

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onSubmit,
  onCancel
}) => {
  const { addCategory, updateCategory } = useExpense();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || predefinedColors[0],
    icon: category?.icon || 'tag'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const categoryData = {
      name: formData.name,
      color: formData.color,
      icon: formData.icon
    };
    
    if (isEditing && category) {
      updateCategory({ ...categoryData, id: category.id });
    } else {
      addCategory(categoryData);
    }
    
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Category' : 'New Category'}
      </h2>

      <Input
        label="Category Name"
        type="text"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        fullWidth
        placeholder="e.g. Groceries, Rent, Transportation"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200 ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          icon={<Save size={18} />}
        >
          {isEditing ? 'Update' : 'Save'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;