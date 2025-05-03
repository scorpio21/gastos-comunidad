import * as XLSX from 'xlsx';
import { Expense } from '../types';
import { formatDate, formatCurrency } from './helpers';

/**
 * Función para formatear los datos de las deudas en rojo
 */
const formatDebtValue = (value: number): string => {
  return `[RED]${formatCurrency(value)}`;
};

export const exportToExcel = (expenses: Expense[]) => {
  // Organizar los gastos por categoría
  const categorizedExpenses = {
    casa: {
      gastos: expenses.filter(e => e.category === 'Gastos Comunidad Casa'),
      extras: expenses.filter(e => e.category === 'Extras Comunidad Casa'),
      deuda: expenses.filter(e => e.category === 'Deuda Comunidad Casa')
    },
    garaje: {
      gastos: expenses.filter(e => e.category === 'Gastos Comunidad Garaje'),
      extras: expenses.filter(e => e.category === 'Extras Garaje'),
      deuda: expenses.filter(e => e.category === 'Deuda Garaje')
    }
  };

  // Crear hojas de trabajo para cada categoría
  const workbook = XLSX.utils.book_new();
  
  // Establecer propiedades del libro
  workbook.Props = {
    Title: 'Gastos Comunidad',
    Subject: 'Resumen de Gastos',
    Author: 'Aplicación de Gastos',
    CreatedDate: new Date()
  };

  // Función para crear una hoja de trabajo
  const createSheet = (expenses: Expense[], sheetName: string, isDebtSheet: boolean = false) => {
    // Si no hay gastos, crear una hoja vacía con encabezados
    if (expenses.length === 0) {
      const worksheet = XLSX.utils.aoa_to_sheet([['Fecha', 'Descripción', 'Importe']]);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [{ wch: 12 }, { wch: 40 }, { wch: 15 }];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      return;
    }
    
    // Preparar los datos para la hoja con formato mejorado
    const data = expenses.map(expense => {
      // Asegurarse de que amount sea un número válido
      const amount = Number(expense.amount) || 0;
      
      // Formatear el importe con color rojo si es una hoja de deudas
      const formattedAmount = isDebtSheet ? 
        formatDebtValue(amount) : 
        formatCurrency(amount);
      
      return {
        'Fecha': formatDate(expense.date),
        'Descripción': expense.description,
        'Importe': formattedAmount
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajustar ancho de columnas
    worksheet['!cols'] = [{ wch: 12 }, { wch: 40 }, { wch: 15 }];
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  };

  // Crear una hoja con todos los gastos
  const allData = expenses.map(expense => {
    // Asegurarse de que amount sea un número válido
    const amount = Number(expense.amount) || 0;
    
    // Determinar si es una deuda para formatear en rojo
    const isDebt = expense.category.toLowerCase().includes('deuda');
    const formattedAmount = isDebt ? 
      formatDebtValue(amount) : 
      formatCurrency(amount);
    
    return {
      'Fecha': formatDate(expense.date),
      'Categoría': expense.category,
      'Descripción': expense.description,
      'Importe': formattedAmount,
      'Tipo': expense.isIncome ? 'Ingreso' : 'Gasto'
    };
  });
  
  const allExpensesWorksheet = XLSX.utils.json_to_sheet(allData);
  
  // Ajustar ancho de columnas para la hoja de todos los gastos
  allExpensesWorksheet['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 10 }];
  
  XLSX.utils.book_append_sheet(workbook, allExpensesWorksheet, 'Todos los Gastos');

  // Crear hojas para cada categoría
  createSheet(categorizedExpenses.casa.gastos, 'Gastos Casa');
  createSheet(categorizedExpenses.casa.extras, 'Extras Casa');
  createSheet(categorizedExpenses.casa.deuda, 'Deuda Casa', true); // true indica que es una hoja de deudas
  createSheet(categorizedExpenses.garaje.gastos, 'Gastos Garaje');
  createSheet(categorizedExpenses.garaje.extras, 'Extras Garaje');
  createSheet(categorizedExpenses.garaje.deuda, 'Deuda Garaje', true); // true indica que es una hoja de deudas

  // Guardar el archivo con opciones de formato
  const opts: XLSX.WritingOptions = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true
  };
  
  XLSX.writeFile(workbook, 'gastos_comunidad.xlsx', opts);
};