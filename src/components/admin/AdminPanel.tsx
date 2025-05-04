import React, { useState } from 'react';
import { Trash2, RefreshCw, Database, AlertTriangle, Tag } from 'lucide-react';
import Button from '../ui/Button';

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

  // Opciones de administración
  const adminOptions: AdminOption[] = [
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
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Database className="mr-2 h-6 w-6 text-gray-700" />
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona la base de datos y realiza tareas de mantenimiento. Ten cuidado con las acciones peligrosas.
        </p>
      </div>

      {/* Mensaje de resultado */}
      {result && (
        <div className={`mb-6 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-medium">{result.message}</p>
        </div>
      )}

      {/* Lista de opciones */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminOptions.map((option) => (
          <div 
            key={option.id} 
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
              option.dangerous ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start mb-3">
              {option.icon}
              <h2 className="text-lg font-semibold ml-2">{option.title}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">{option.description}</p>
            
            {option.dangerous && showConfirmation !== option.id ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowConfirmation(option.id)}
                disabled={isLoading !== null}
                className="w-full"
              >
                Ejecutar
              </Button>
            ) : option.dangerous && showConfirmation === option.id ? (
              <div className="space-y-2">
                <p className="text-red-600 text-xs flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={option.action}
                    disabled={isLoading !== null}
                    className="flex-1"
                    isLoading={isLoading === option.id}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowConfirmation(null)}
                    disabled={isLoading !== null}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={option.action}
                disabled={isLoading !== null}
                isLoading={isLoading === option.id}
                className="w-full"
              >
                Ejecutar
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
