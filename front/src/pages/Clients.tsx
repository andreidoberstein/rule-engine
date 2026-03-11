import { useState, useEffect } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';

interface Client {
  id: string;
  client_code: string;
  client_name: string;
  document: string;
  email: string;
  job_codes: string;
  new_format_flag: boolean;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [cursors, setCursors] = useState<string[]>([]); // Stack of cursors for "Previous"
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async (cursor: string | null) => {
    try {
      setIsLoading(true);
      const url = new URL('http://localhost:3000/clients');
      url.searchParams.append('take', '5');
      if (cursor) {
        url.searchParams.append('cursor', cursor);
      }

      const response = await fetch(url.toString());
      const res = await response.json();
      
      setClients(res.data);
      setNextCursor(res.nextCursor);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentCursor);
  }, [currentCursor]);

  const handleNext = () => {
    if (nextCursor) {
      setCursors(prev => [...prev, currentCursor || '']);
      setCurrentCursor(nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursors.length > 0) {
      const newCursors = [...cursors];
      const prevCursor = newCursors.pop() || null;
      setCursors(newCursors);
      setCurrentCursor(prevCursor === '' ? null : prevCursor);
    }
  };

  return (
    <Layout 
      title="Clientes" 
      subtitle="Gerencie seus clientes cadastrados"
    >
      {/* Header action right aligned, handled by absolute positioning or relative to a wrapper */}
      <div className="absolute top-[108px] right-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <span className="text-lg leading-none">+</span> Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Nome / Razão Social</th>
                <th className="px-6 py-4">CNPJ</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Jobs</th>
                <th className="px-6 py-4">Novo Formato</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Carregando clientes...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{client.client_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.client_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.document}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.job_codes}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${client.new_format_flag ? 'text-emerald-500' : 'text-gray-500'}`}>
                        {client.new_format_flag ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-semibold text-gray-900">{clients.length}</span> registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={cursors.length === 0 || isLoading}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!nextCursor || isLoading}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
