import React, { useEffect, useState } from 'react';

interface PersonalDebt {
  id: number;
  name: string;
  concept: string;
  amount: number;
  date: string;
  status: string;
}

const PersonalDebtBars: React.FC = () => {
  const [debts, setDebts] = useState<PersonalDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/gastos/api/personal-debts.php');
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setDebts(data.data);
        } else if (Array.isArray(data)) {
          setDebts(data);
        } else if (Array.isArray(data.debts)) {
          setDebts(data.debts);
        } else {
          setDebts([]);
        }
      } catch (err) {
        setError('Error al cargar las deudas personales');
      } finally {
        setLoading(false);
      }
    };
    fetchDebts();
  }, []);

  // Agrupar deudas por nombre
  const debtByUser: Record<string, number> = {};
  debts.forEach(e => {
    const username = e.name || 'Desconocido';
    debtByUser[username] = (debtByUser[username] || 0) + Number(e.amount || 0);
  });
  const totalDebt = Object.values(debtByUser).reduce((a, b) => a + b, 0);

  if (loading) {
    return <div className="mt-6 p-4 bg-white rounded shadow">Cargando deudas personales...</div>;
  }
  if (error) {
    return <div className="mt-6 p-4 bg-white rounded shadow text-red-600">{error}</div>;
  }
  if (Object.keys(debtByUser).length === 0) {
    return (
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Deudas personales</h2>
        <p className="text-gray-500">No hay deudas personales registradas.</p>
      </div>
    );
  }
  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Deudas personales</h2>
      <div className="space-y-2">
        {Object.entries(debtByUser).map(([user, amount]) => {
          const percent = totalDebt > 0 ? (amount / totalDebt) * 100 : 0;
          return (
            <div key={user}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{user}</span>
                <span>{amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} ({percent.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalDebtBars;
