import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipo para el usuario autenticado
interface AuthUser {
  id: number;
  username: string;
  name: string;
}

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estado de autenticación desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      
      // Verificar token con el servidor
      checkAuth(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Función para verificar la autenticación con el servidor
  const checkAuth = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/check-auth.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (!data.isAuthenticated) {
        // Token inválido, cerrar sesión
        logout();
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        
        // Guardar en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        
        return true;
      } else {
        setError(data.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo más tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  // Valor del contexto
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
