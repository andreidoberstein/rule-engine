import { useState, useEffect } from 'react';
import { ShieldAlert, Clock, FileText, Database, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/audit-logs?take=50');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
      } else {
        toast.error('Erro ao listar logs');
      }
    } catch {
      toast.error('Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatData = (data: any) => {
    if (!data) return '-';
    return (
      <pre className="text-xs bg-gray-50 border border-gray-100 p-2 rounded max-h-32 overflow-y-auto w-full max-w-xs truncate text-gray-500 hover:max-w-none hover:whitespace-pre-wrap transition-all">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <Layout 
      title="Logs de Sistema" 
      subtitle="Visualize o histórico de alterações críticas do sistema"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-gray-400" />
          <h2 className="text-gray-700 font-semibold tracking-wide">Trilha de Auditoria</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Usuário</th>
                <th className="px-5 py-4">Tabela/Ação</th>
                <th className="px-5 py-4">Antes</th>
                <th className="px-5 py-4">Depois</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">Carregando logs de auditoria...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Nenhum log encontrado no sistema.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {log.user?.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">{log.user?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 ml-8">{log.user?.email}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 border px-2 py-0.5 rounded bg-gray-50">
                          {log.entity_name}
                        </span>
                      </div>
                      <div className="mt-1.5 flex ml-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                          log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {formatData(log.old_data)}
                    </td>
                    <td className="px-5 py-4">
                      {log.action === 'UPDATE' && <ArrowRight className="w-4 h-4 text-gray-300 inline-block mr-2" />}
                      {formatData(log.new_data)}
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
