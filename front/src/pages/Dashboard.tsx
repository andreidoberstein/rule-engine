import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout title="Dashboard" subtitle="Visão geral do seu painel administrativo">
      {/* Metric Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500">Total de Clientes</p>
            <div className="bg-blue-50 p-2 rounded-lg"><Users size={16} className="text-blue-600" /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-4">48</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2">+ 12% em relação ao mês anterior</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500">Orçamentos Ativos</p>
            <div className="bg-green-50 p-2 rounded-lg"><FileText size={16} className="text-green-600" /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-4">23</h3>
          <p className="text-xs font-medium text-gray-400 mt-2">15 aguardando aprovação</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500">Faturamento Mensal</p>
            <div className="bg-purple-50 p-2 rounded-lg"><DollarSign size={16} className="text-purple-600" /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-4">R$ 125.4k</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2">+ 8.2% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500">Taxa de Crescimento</p>
            <div className="bg-orange-50 p-2 rounded-lg"><TrendingUp size={16} className="text-orange-600" /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-4">12.5%</h3>
          <p className="text-xs font-medium text-gray-400 mt-2">Média dos últimos 3 meses</p>
        </div>
      </div>

      {/* Lower Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Atividades Recentes</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa ABC</p>
                <p className="text-gray-500 text-sm mt-0.5">Novo orçamento criado</p>
              </div>
              <span className="text-xs text-gray-400">2h atrás</span>
            </div>
            <div className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa XYZ</p>
                <p className="text-gray-500 text-sm mt-0.5">Fechamento aprovado</p>
              </div>
              <span className="text-xs text-gray-400">4h atrás</span>
            </div>
            <div className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa 123</p>
                <p className="text-gray-500 text-sm mt-0.5">Cliente cadastrado</p>
              </div>
              <span className="text-xs text-gray-400">1d atrás</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa DEF</p>
                <p className="text-gray-500 text-sm mt-0.5">Orçamento atualizado</p>
              </div>
              <span className="text-xs text-gray-400">2d atrás</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Próximos Fechamentos</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa ABC</p>
                <p className="text-gray-500 text-sm mt-0.5">Novembro 2024</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">Pendente</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa XYZ</p>
                <p className="text-gray-500 text-sm mt-0.5">Novembro 2024</p>
              </div>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">Em análise</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa 123</p>
                <p className="text-gray-500 text-sm mt-0.5">Dezembro 2024</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Agendado</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Empresa DEF</p>
                <p className="text-gray-500 text-sm mt-0.5">Dezembro 2024</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Agendado</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
