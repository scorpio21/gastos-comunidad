import { useState } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import AuthProvider from './context/AuthContext';
import Header from './components/layout/Header';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Categories from './views/Categories';
import Charts from './views/Charts';
import AdminPanel from './components/admin/AdminPanel';
import AdminTransactions from './views/AdminTransactions';
import ExpenseForm from './components/expenses/ExpenseForm';
import Card, { CardContent } from './components/ui/Card';
import Loading from './components/ui/Loading';

// Componente de aplicación con estado
const AppContent = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { isLoading, error } = useExpense();
  
  const openAddExpense = () => {
    setShowAddExpense(true);
  };
  
  const closeAddExpense = () => {
    setShowAddExpense(false);
  };
  
  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'charts':
        return <Charts />;
      case 'admin':
        return <AdminPanel />;
      case 'admin-transactions':
        return <AdminTransactions />;
      default:
        return <Dashboard />;
    }
  };
  
  if (isLoading) {
    return <Loading message="Cargando datos de la aplicación..." />;
  }
  
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg m-4">
        <h2 className="text-xl font-semibold mb-2">Error de Conexión</h2>
        <p>{error}</p>
        <div className="mt-6 bg-white p-4 rounded-lg text-left text-gray-700 text-sm">
          <h3 className="font-semibold mb-2">Pasos para solucionar:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Verifica que XAMPP esté en ejecución con Apache y MySQL activos.</li>
            <li>Comprueba que la base de datos <code className="bg-gray-100 px-1">gastos_app</code> existe en phpMyAdmin.</li>
            <li>Verifica que la ruta de la API es correcta: <code className="bg-gray-100 px-1">http://localhost/api</code></li>
            <li>Intenta acceder directamente a <a href="http://localhost/api/test.php" target="_blank" className="text-blue-600 underline">http://localhost/api/test.php</a> para verificar que la API es accesible.</li>
          </ol>
          <div className="mt-4">
            <p>Si el enlace de prueba no funciona, revisa la ruta de instalación de XAMPP y ajusta la URL base en el archivo:</p>
            <code className="block bg-gray-100 p-2 mt-1">src/utils/api.ts</code>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        openAddExpense={openAddExpense} 
        setCurrentView={setCurrentView}
        currentView={currentView}
        closeAddExpense={closeAddExpense}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showAddExpense ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <ExpenseForm onSubmit={closeAddExpense} onCancel={closeAddExpense} />
            </CardContent>
          </Card>
        ) : null}
        
        {renderView()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            GestiónGastos © {new Date().getFullYear()} - Gestión de Gastos Simplificada - Por Scorpio
          </p>
        </div>
      </footer>
    </div>
  );
};

// Componente principal que proporciona el contexto
function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;