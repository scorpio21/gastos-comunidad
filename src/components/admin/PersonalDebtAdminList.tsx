import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { Trash2 } from 'lucide-react';

interface PersonalDebt {
  id: number;
  name: string;
  concept: string;
  amount: number;
  date: string;
  status: string;
}

const PersonalDebtAdminList: React.FC = () => {
  const [debts, setDebts] = useState<PersonalDebt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const fetchDebts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/personal-debts.php');
      const data = await res.json();
      if (data.success) {
        setDebts(data.data);
      } else {
        setError(data.message || 'Error al obtener deudas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta deuda?')) return;
    setDeletingId(id);
    setResult(null);
    try {
      const res = await fetch(`/api/personal-debts.php?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setResult('Deuda eliminada correctamente.');
        setDebts(debts.filter(d => d.id !== id));
      } else {
        setResult(data.message || 'Error al eliminar la deuda');
      }
    } catch (err) {
      setResult('Error de conexión');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Gestión Individual de Deudas Personales</h3>
      {result && (
        <div className="mb-4 p-2 rounded text-sm bg-green-100 text-green-700">{result}</div>
      )}
      {loading ? (
        <div>Cargando deudas...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : debts.length === 0 ? (
        <div>No hay deudas personales registradas.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">ID</th>
                <th className="px-2 py-1 border">Nombre</th>
                <th className="px-2 py-1 border">Concepto</th>
                <th className="px-2 py-1 border">Cantidad</th>
                <th className="px-2 py-1 border">Fecha</th>
                <th className="px-2 py-1 border">Estado</th>
                <th className="px-2 py-1 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {debts.map(debt => (
                <tr key={debt.id}>
                  <td className="px-2 py-1 border">{debt.id}</td>
                  <td className="px-2 py-1 border">{debt.name}</td>
                  <td className="px-2 py-1 border">{debt.concept}</td>
                  <td className="px-2 py-1 border">{debt.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="px-2 py-1 border">{new Date(debt.date).toLocaleDateString()}</td>
                  <td className="px-2 py-1 border">{debt.status}</td>
                  <td className="px-2 py-1 border text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(debt.id)}
                      disabled={deletingId === debt.id}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      {deletingId === debt.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PersonalDebtAdminList;
