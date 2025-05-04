import React, { useState } from 'react';
import { Wallet, Plus, Menu, X, LogIn, LogOut, Shield } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../admin/LoginModal';

interface HeaderProps {
  openAddExpense: () => void;
  setCurrentView: (view: string) => void;
  currentView: string;
  // Añadir la función para cerrar el formulario de nuevo gasto
  closeAddExpense?: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAddExpense, setCurrentView, currentView, closeAddExpense }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    { label: 'Panel', value: 'dashboard' },
    { label: 'Transacciones', value: 'transactions' },
    { label: 'Categorías', value: 'categories' },
    { label: 'Gráficos', value: 'charts' },
  ];
  
  // Item de administrador
  const adminItems = [
    { label: 'Panel Admin', value: 'admin' }
  ];
  
  const handleNavClick = (view: string) => {
    // Si el usuario intenta acceder al panel de administración sin estar autenticado
    if (view === 'admin' && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    // Cerrar el formulario de nuevo gasto si está abierto
    if (closeAddExpense) {
      closeAddExpense();
    }
    
    setCurrentView(view);
    setIsMenuOpen(false);
  };
  
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };
  
  const handleLogoutClick = () => {
    logout();
    // Si estamos en la vista de administrador, redirigir al dashboard
    if (currentView === 'admin') {
      setCurrentView('dashboard');
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Wallet className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">GestiónGastos</span>
            </div>
            <nav className="hidden md:ml-8 md:flex items-center">
              {/* Menú principal */}
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.value}
                    className={`px-3 py-2 text-sm font-medium rounded-md min-w-[100px] ${
                      currentView === item.value
                        ? 'text-teal-600 bg-teal-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    } transition-colors duration-150 ease-in-out`}
                    onClick={() => handleNavClick(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              {/* Separador vertical cuando hay botones de admin */}
              {isAuthenticated && (
                <div className="h-6 w-px bg-gray-200 mx-4"></div>
              )}
              
              {/* Botones de Administrador */}
              {isAuthenticated && (
                <div className="flex space-x-4">
                  {adminItems.map(item => (
                    <button
                      key={item.value}
                      className={`px-3 py-2 text-sm font-medium rounded-md min-w-[100px] flex items-center justify-center ${
                        currentView === item.value
                          ? 'text-red-600 bg-red-50 border-red-200'
                          : 'text-gray-500 hover:text-red-700 hover:bg-red-50 border-gray-200'
                      } transition-colors duration-150 ease-in-out border`}
                      onClick={() => handleNavClick(item.value)}
                    >
                      <Shield className="mr-1 h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              onClick={openAddExpense}
            >
              Add Transaction
            </Button>
            
            {/* Botón de inicio/cierre de sesión */}
            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="md"
                icon={<LogOut size={16} />}
                onClick={handleLogoutClick}
              >
                Salir
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                icon={<LogIn size={16} />}
                onClick={handleLoginClick}
              >
                Admin
              </Button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={openAddExpense}
              className="mr-2"
            >
              New
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.value}
                className={`block px-4 py-2 text-base font-medium w-full text-left ${
                  currentView === item.value
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleNavClick(item.value)}
              >
                {item.label}
              </button>
            ))}
            
            {/* Opciones de Administrador en el menú móvil - solo si está autenticado */}
            {isAuthenticated && adminItems.map(item => (
              <button
                key={item.value}
                className={`block px-4 py-2 text-base font-medium w-full text-left ${
                  currentView === item.value
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-500 hover:text-red-700 hover:bg-red-50'
                } border-t border-gray-200 mt-2 pt-2 flex items-center`}
                onClick={() => handleNavClick(item.value)}
              >
                <Shield className="mr-2 h-5 w-5" />
                {item.label}
              </button>
            ))}
            
            
            {/* Botón de inicio/cierre de sesión en el menú móvil */}
            <button
              className={`block px-4 py-2 text-base font-medium w-full text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 mt-2 pt-2 flex items-center`}
              onClick={isAuthenticated ? handleLogoutClick : handleLoginClick}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar sesión
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Acceso Admin
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de inicio de sesión */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;