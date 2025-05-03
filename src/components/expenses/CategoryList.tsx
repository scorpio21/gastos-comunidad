import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { useExpense } from '../../context/ExpenseContext';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { categories, deleteCategory } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };
  
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };
  
  if (showForm) {
    return (
      <Card>
        <CardContent>
          <CategoryForm 
            category={editingCategory}
            onSubmit={handleFormClose}
            onCancel={handleFormClose}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddNew}
        >
          Añadir Categoría
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-gray-100">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm font-medium text-gray-800">{category.name}</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-gray-500">
            <p>No se encontraron categorías.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;