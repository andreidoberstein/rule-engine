import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '../components/Layout';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/budgets?take=10')
      .then(res => res.json())
      .then(data => setBudgets(data.data || []))
      .catch(() => toast.error('Erro ao buscar orçamentos'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout 
      title="Orçamentos" 
      subtitle="Gerencie os orçamentos ativos e crie novas precificações"
    >
      <div className="absolute top-[108px] right-8">
        <Link to="/budgets/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Novo Orçamento
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar orçamento por cliente ou ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">ID Orçamento</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Carregando orçamentos...
                  </td>
                </tr>
              ) : budgets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-600 font-medium">Nenhum orçamento encontrado</p>
                      <p className="text-sm text-gray-400 mt-1">Crie o seu primeiro orçamento clicando no botão acima.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                budgets.map((b: {id: string, client: {client_name: string}, dates?: string, total: number, status: string}) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-l-4 border-l-transparent hover:border-l-blue-500">
                      #{b.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {b.client?.client_name || 'Cliente Removido'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.dates || 'Não definido'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(b.total)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {b.status === 'DRAFT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <Clock className="w-3.5 h-3.5" /> Rascunho
                        </span>
                      )}
                      {b.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link to={`/budgets/${b.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                          Detalhes
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
