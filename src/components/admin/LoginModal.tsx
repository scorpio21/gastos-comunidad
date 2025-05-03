import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    const success = await login(username, password);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-teal-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Acceso Administrador</h2>
          <p className="text-gray-600 mt-1">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="admin"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Credenciales por defecto: admin / admin123
            </p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
