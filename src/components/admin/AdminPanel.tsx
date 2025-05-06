import React, { useState } from 'react';
import { Trash2, RefreshCw, Tag, Receipt } from 'lucide-react';
import Button from '../ui/Button';
import AdminTransactionList from './AdminTransactionList';
import PersonalDebtAdminList from './PersonalDebtAdminList';

// Interfaz para las opciones de administración
interface AdminOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  dangerous: boolean;
}

const AdminPanel: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('main');

  // Función para limpiar la base de datos (eliminar todos los registros)
  const clearDatabase = async () => {
    setIsLoading('clearDatabase');
    setResult(null);
    
    try {
      // Primero probemos con el script de prueba para ver si funciona
      const testResponse = await fetch('/api/admin/test-json.php');
      let testText = '';
      
      try {
        // Intentar obtener el texto de la respuesta para depuración
        testText = await testResponse.text();
        console.log('Respuesta de prueba (texto):', testText);
        
        // Intentar parsear como JSON
        const testJson = JSON.parse(testText);
        console.log('Respuesta de prueba (JSON):', testJson);
      } catch (testError) {
        console.error('Error al procesar la respuesta de prueba:', testError);
        console.log('Texto de respuesta de prueba:', testText);
      }
      
      // Usar el script de limpieza de base de datos
      const response = await fetch('/api/admin/simple-clear-db.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Obtener el texto de la respuesta para depuración
      const responseText = await response.text();
      console.log('Respuesta del servidor (texto):', responseText);
      
      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Respuesta del servidor (JSON):', data);
        
        if (data.success) {
          setResult({
            success: true,
            message: 'Base de datos limpiada correctamente. Se han eliminado todos los registros.'
          });
        } else {
          setResult({
            success: false,
            message: `Error al limpiar la base de datos: ${data.message}`
          });
        }
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        setResult({
          success: false,
          message: `Error al procesar la respuesta: ${responseText.substring(0, 100)}...`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsLoading(null);
      setShowConfirmation(null);
    }
  };

  // Función para eliminar transacciones antiguas (más de 1 año)
  const deleteOldTransactions = async () => {
    setIsLoading('deleteOldTransactions');
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/delete-old-transactions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: `Transacciones antiguas eliminadas correctamente. Se han eliminado ${data.count} registros.`
        });
      } else {
        setResult({
          success: false,
          message: `Error al eliminar transacciones antiguas: ${data.message}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsLoading(null);
      setShowConfirmation(null);
    }
  };

  // Función para optimizar la base de datos
  const optimizeDatabase = async () => {
    setIsLoading('optimizeDatabase');
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/optimize-database.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: 'Base de datos optimizada correctamente.'
        });
      } else {
        setResult({
          success: false,
          message: `Error al optimizar la base de datos: ${data.message}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsLoading(null);
    }
  };

  // Función para restaurar categorías
  const restoreCategories = async () => {
    setIsLoading('restoreCategories');
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/restore-categories.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: `Categorías restauradas correctamente. ${data.categorias_restauradas > 0 ? `Se han restaurado ${data.categorias_restauradas} categorías.` : 'Las categorías ya existían.'}`
        });
      } else {
        setResult({
          success: false,
          message: `Error al restaurar categorías: ${data.error || data.message || 'Error desconocido'}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsLoading(null);
      setShowConfirmation(null);
    }
  };

  // Función para borrar todas las deudas personales
  const clearPersonalDebts = async () => {
    setIsLoading('clearPersonalDebts');
    setResult(null);
    try {
      const response = await fetch('/api/admin/clear-personal-debts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.message });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsLoading(null);
      setShowConfirmation(null);
    }
  };

  // Opciones de administración
  const adminOptions: AdminOption[] = [
    {
      id: 'clearPersonalDebts',
      title: 'Eliminar Todas las Deudas Personales',
      description: 'Borra permanentemente todas las deudas personales del sistema. Esta acción no se puede deshacer.',
      icon: <Trash2 className="h-6 w-6 text-purple-500" />,
      action: clearPersonalDebts,
      dangerous: true
    },
    {
      id: 'restoreCategories',
      title: 'Restaurar Categorías',
      description: 'Restaura las categorías predeterminadas si faltan o la tabla está vacía.',
      icon: <Tag className="h-6 w-6 text-blue-500" />,
      action: restoreCategories,
      dangerous: false
    },
    {
      id: 'clearDatabase',
      title: 'Limpiar Base de Datos',
      description: 'Elimina todos los registros de la base de datos. Esta acción no se puede deshacer.',
      icon: <Trash2 className="h-6 w-6 text-red-500" />,
      action: clearDatabase,
      dangerous: true
    },
    {
      id: 'deleteOldTransactions',
      title: 'Eliminar Transacciones Antiguas',
      description: 'Elimina transacciones con más de 1 año de antigüedad.',
      icon: <Trash2 className="h-6 w-6 text-orange-500" />,
      action: deleteOldTransactions,
      dangerous: true
    },
    {
      id: 'optimizeDatabase',
      title: 'Optimizar Base de Datos',
      description: 'Optimiza las tablas de la base de datos para mejorar el rendimiento.',
      icon: <RefreshCw className="h-6 w-6 text-teal-500" />,
      action: optimizeDatabase,
      dangerous: false
    }
  ];

  // Renderizar el panel de administración
  if (currentSection === 'transactions') {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Administración de Transacciones</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentSection('main')}
          >
            Volver al Panel
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <AdminTransactionList />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>
      
      {/* Mostrar resultado si existe */}
      {result && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Botón de Administración de Transacciones */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <Receipt className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Administrar Transacciones</h3>
              <p className="text-gray-600 text-sm">Gestiona todas las transacciones del sistema. Edita, elimina o revisa el historial completo.</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentSection('transactions')}
            >
              Gestionar Transacciones
            </Button>
          </div>
        </div>

        {/* Resto de opciones de administración */}
        {adminOptions.map((option) => (
          <div
            key={option.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-3">
                {option.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            </div>

            <div className="mt-4">
              {showConfirmation === option.id ? (
                <div className="space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={option.action}
                    disabled={isLoading === option.id}
                  >
                    {isLoading === option.id ? 'Procesando...' : 'Confirmar'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowConfirmation(null)}
                    disabled={isLoading === option.id}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  variant={option.dangerous ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => option.dangerous ? setShowConfirmation(option.id) : option.action()}
                  disabled={isLoading === option.id}
                >
                  {isLoading === option.id ? 'Procesando...' : 'Ejecutar'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Gestión individual de deudas personales */}
      <PersonalDebtAdminList />
    </div>
  );
};

export default AdminPanel;
