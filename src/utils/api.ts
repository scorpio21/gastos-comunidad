// API base URL
// Ajustamos la URL para que coincida con la ubicación del backend en XAMPP
// Nota: Esta URL debe coincidir exactamente con la ruta donde están los archivos PHP en XAMPP
// Usar la ruta completa incluyendo la carpeta del proyecto
const API_BASE_URL = '/gastos/api';

// Asegurarnos de que la URL base sea correcta
console.log('API_BASE_URL:', API_BASE_URL);

// Asegurarnos de que todas las rutas usen la base correcta
const getApiUrl = (endpoint: string) => `${API_BASE_URL}/${endpoint}`;

// Función para verificar la conexión a la API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl('index.php'));
    if (!response.ok) {
      console.error('Error al conectar con la API:', await response.text());
      return false;
    }
    const data = await response.json();
    console.log('Conexión a la API exitosa:', data);
    return true;
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    return false;
  }
};

// Interfaces
import { Expense, Category } from '../types';

// API para categorías
export const categoryApi = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await fetch(getApiUrl('categories.php'));
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Crear una nueva categoría
  create: async (category: Omit<Category, 'id'>): Promise<{ id: string }> => {
    try {
      const response = await fetch(getApiUrl('categories.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  update: async (category: Category): Promise<void> => {
    try {
      const response = await fetch(getApiUrl('categories.php'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Eliminar una categoría
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${getApiUrl('categories.php')}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },
};

// API para gastos
export const expenseApi = {
  // Obtener todos los gastos con filtros opcionales
  getAll: async (filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: 'all' | 'expense' | 'income';
  }): Promise<Expense[]> => {
    try {
      let url = getApiUrl('expenses.php');
      
      // Añadir filtros a la URL si existen
      if (filters) {
        const queryParams = new URLSearchParams();
        
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.type) queryParams.append('type', filters.type);
        
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener gastos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Crear un nuevo gasto
  create: async (expense: Omit<Expense, 'id'>): Promise<{ id: string }> => {
    try {
      const response = await fetch(getApiUrl('expenses.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear gasto');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Actualizar un gasto existente
  update: async (expense: Expense): Promise<void> => {
    try {
      const response = await fetch(getApiUrl('expenses.php'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar gasto');
      }
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },

  // Eliminar un gasto
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${getApiUrl('expenses.php')}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar gasto');
      }
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  },
};
