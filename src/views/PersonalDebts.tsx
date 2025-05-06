import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle, Plus, Calendar } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
// Importaciones de React y componentes UI

// Definir la interfaz para una deuda personal
interface DebtItem {
  id: string;
  name: string;
  concept: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  created_at?: string;
  updated_at?: string;
}

// Componente para el formulario de deudas personales
const DebtForm: React.FC<{
  onClose: () => void;
  editingDebt: DebtItem | null;
  onSave: (debt: Omit<DebtItem, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
}> = ({ onClose, editingDebt, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    concept: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'pending' | 'paid'
  });

  useEffect(() => {
    if (editingDebt) {
      setFormData({
        name: editingDebt.name,
        concept: editingDebt.concept,
        amount: editingDebt.amount.toString(),
        date: editingDebt.date,
        status: editingDebt.status
      });
    }
  }, [editingDebt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const debtData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingDebt) {
      onSave({ ...debtData, id: editingDebt.id });
    } else {
      onSave(debtData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold mb-4">
          {editingDebt ? 'Editar Deuda Personal' : 'Nueva Deuda Personal'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Concepto</label>
            <input
              type="text"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {editingDebt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              {editingDebt ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Formato para moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Formato para fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

// Vista principal de deudas personales
const PersonalDebts: React.FC = () => {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);

  // Cargar las deudas al montar el componente
  useEffect(() => {
    fetchDebts();
  }, []);

  // Función para cargar las deudas desde la API
  const fetchDebts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/gastos/api/personal-debts.php`);
      const data = await response.json();
      
      if (data.success) {
        setDebts(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || 'Error al cargar las deudas personales');
        setDebts([]);
      }
    } catch (err) {
      console.error('Error fetching debts:', err);
      setError('Error al conectar con el servidor');
      setDebts([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar una deuda (crear o actualizar)
  const handleSaveDebt = async (debt: Omit<DebtItem, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    try {
      setLoading(true);
      
      const method = debt.id ? 'PUT' : 'POST';
      const url = `/gastos/api/personal-debts.php${debt.id ? `?id=${debt.id}` : ''}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(debt)
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchDebts(); // Recargar las deudas después de guardar
        setShowForm(false);
        setEditingDebt(null);
      } else {
        throw new Error(data.message || `Error al ${debt.id ? 'actualizar' : 'crear'} la deuda`);
      }
    } catch (err) {
      console.error('Error saving debt:', err);
      alert(`Error al ${debt.id ? 'actualizar' : 'crear'} la deuda`);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una deuda
  const handleDeleteDebt = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
      try {
        setLoading(true);
        
        const response = await fetch(`/gastos/api/personal-debts.php?id=${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchDebts(); // Recargar las deudas después de eliminar
        } else {
          throw new Error(data.message || 'Error al eliminar la deuda');
        }
      } catch (err) {
        console.error('Error deleting debt:', err);
        alert('Error al eliminar la deuda');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para marcar una deuda como pagada
  const handleMarkAsPaid = async (id: string) => {
    try {
      setLoading(true);
      
      const debt = debts.find(d => d.id === id);
      
      if (debt) {
        const updatedDebt = { ...debt, status: 'paid' };
        
        const response = await fetch(`/gastos/api/personal-debts.php?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDebt)
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchDebts(); // Recargar las deudas después de actualizar
        } else {
          throw new Error(data.message || 'Error al marcar la deuda como pagada');
        }
      }
    } catch (err) {
      console.error('Error marking debt as paid:', err);
      alert('Error al marcar la deuda como pagada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Deudas Personales</h2>
          <Button
            variant="primary"
            onClick={() => {
              setEditingDebt(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Deuda
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <span className="ml-3">Cargando deudas personales...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {debts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No hay deudas personales registradas.</p>
                </div>
              ) : (
                debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${debt.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}
                        >
                          {debt.status === 'paid' ? (
                            <CheckCircle size={18} className="text-green-600" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{debt.name}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{debt.concept}</span>
                          <div className="flex items-center ml-2 text-xs text-gray-500">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(debt.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="text-base font-medium text-gray-900">
                        {formatCurrency(debt.amount)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingDebt(debt);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        {debt.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(debt.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteDebt(debt.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <DebtForm
          onClose={() => {
            setShowForm(false);
            setEditingDebt(null);
          }}
          editingDebt={editingDebt}
          onSave={handleSaveDebt}
        />
      )}
    </div>
  );
};

export default PersonalDebts;
