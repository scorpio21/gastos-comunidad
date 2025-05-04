import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/expenses/ExpenseForm';
import AdminTransactionList from '../components/admin/AdminTransactionList';
import { Expense } from '../types';

const AdminTransactions: React.FC = () => {
  const { expenses } = useExpense();
  const { isAuthenticated } = useAuth();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Verificar si el usuario es administrador
  const isAdmin = () => {
    try {
      const storedUserStr = localStorage.getItem('authUser');
      return isAuthenticated && !!storedUserStr;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  };
  
  // Redirigir si no está autenticado o no es administrador
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader className="bg-red-50 border-b border-red-100">
            <h2 className="text-lg font-medium text-red-800 p-2">Acceso Denegado</h2>
          </CardHeader>
          <CardContent>
            <div className="p-4">
              <p className="text-red-600">
                {!isAuthenticated 
                  ? "Debes iniciar sesión para acceder a esta página." 
                  : "No tienes permisos de administrador para acceder a esta página."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setEditingExpense(expense);
    }
  };

  const handleFormClose = () => {
    setEditingExpense(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Transacciones</h1>
      
      {editingExpense ? (
        <Card>
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800 p-2">Editar Transacción</h2>
          </CardHeader>
          <CardContent>
            <ExpenseForm 
              expense={editingExpense}
              onSubmit={handleFormClose}
              onCancel={handleFormClose}
            />
          </CardContent>
        </Card>
      ) : (
        <AdminTransactionList 
          title="Administrar Transacciones" 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
};

export default AdminTransactions;
