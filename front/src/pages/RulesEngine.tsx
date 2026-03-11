import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Settings2, ShieldCheck, MapPin, Building2, Calculator, Save, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';

export default function RulesEngine() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);

  const [selectedVerbaType, setSelectedVerbaType] = useState('');
  const [calcType, setCalcType] = useState('FIXED');
  const [value, setValue] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [verbaTypes, setVerbaTypes] = useState([]);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    verba_type_id: '',
    calc_type: '',
    value: '',
    client_id: '',
    state_uf: ''
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDeleteId, setRuleToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch Clients
    fetch('http://localhost:3000/clients?take=50')
      .then(res => res.json())
      .then(data => setClients(data.data || []))
      .catch(() => toast.error('Erro ao carregar clientes'));

    // 2. Fetch Active Rules
    fetch('http://localhost:3000/rule-templates?take=20')
      .then(async res => await res.json())
      .then(data => setRules(data.data || []))
      .catch(() => toast.error('Erro ao carregar regras'))
      .finally(() => setIsLoading(false));
    // 3. Fetch Verba Types
    fetch('http://localhost:3000/budgets/verba-types')
      .then(res => res.json())
      .then(data => setVerbaTypes(data || []))
      .catch(() => toast.error('Erro ao carregar tipos de verba'));
  }, []);
  const handleSaveRule = async () => {
    if (!selectedVerbaType || !calcType || !value) {
      toast.error('Preencha os campos obrigatórios da regra.');
      return;
    }

    const payload = {
      verba_type_id: selectedVerbaType,
      calc_type: calcType,
      value: calcType === 'TEXT' ? 0 : parseFloat(value),
      text_value: calcType === 'TEXT' ? value : undefined,
      client_id: selectedClient || undefined,
      state_uf: selectedState || undefined,
    };

    try {
      const res = await fetch('http://localhost:3000/rule-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success('Regra adicionada com sucesso!');
        window.location.reload();
      } else {
        const err = await res.json();
        toast.error('Erro ao salvar: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao salvar regra.');
    }
  };

  const handleEditClick = (rule: any) => {
    setEditingRule(rule);
    setEditForm({
      verba_type_id: rule.verba_type_id,
      calc_type: rule.calc_type,
      value: rule.calc_type === 'TEXT' ? (rule.text_value || '') : rule.value.toString(),
      client_id: rule.client_id || '',
      state_uf: rule.state_uf || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateRule = async () => {
    if (!editForm.verba_type_id || !editForm.calc_type || !editForm.value) {
      toast.error('Preencha os campos obrigatórios da regra.');
      return;
    }

    const payload = {
      verba_type_id: editForm.verba_type_id,
      calc_type: editForm.calc_type,
      value: editForm.calc_type === 'TEXT' ? 0 : parseFloat(editForm.value),
      text_value: editForm.calc_type === 'TEXT' ? editForm.value : undefined,
      client_id: editForm.client_id || null,
      state_uf: editForm.state_uf || null,
    };

    try {
      const res = await fetch(`http://localhost:3000/rule-templates/${editingRule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success('Regra atualizada com sucesso!');
        setIsEditModalOpen(false);
        window.location.reload();
      } else {
        const err = await res.json();
        toast.error('Erro ao atualizar: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao atualizar regra.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setRuleToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!ruleToDeleteId) return;
    try {
      const res = await fetch(`http://localhost:3000/rule-templates/${ruleToDeleteId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setRules(rules.filter((r: any) => r.id !== ruleToDeleteId));
        toast.success('Verba removida com sucesso!');
      } else {
        const err = await res.json();
        toast.error('Erro ao excluir: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao excluir regra.');
    }
  };

  return (
    <Layout
      title="Motor de Regras (Parametrização)"
      subtitle="Defina o valor base e a métrica de cálculo para cada verba em nível Global, de Estado ou por Cliente."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">

        {/* Formulário de Criação Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-600" /> Nova Regra Base
            </h3>

            <div className="space-y-4">
              {/* Esferas de Atuação */}
              <div className="space-y-3 pb-4 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Contexto de Aplicação</span>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" /> Cliente Específico <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
                  </label>
                  <select
                    title="select client"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                  >
                    <option value="">-- Regra Global (Todos os Clientes) --</option>
                    {clients.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.client_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" /> Estado/Praça <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
                  </label>
                  <select
                    title="select state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                  >
                    <option value="">-- Regra Global (Todos os Estados) --</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                  </select>
                </div>
              </div>

              {/* Variáveis e Cálculo */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Variável & Cálculo</span>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Tipo de Verba
                  </label>
                  <select
                    title="select verba"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={selectedVerbaType}
                    onChange={e => setSelectedVerbaType(e.target.value)}
                  >
                    <option value="">-- Selecione a Verba --</option>
                    {verbaTypes.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.group?.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gray-500" /> Natureza do Cálculo
                  </label>
                  <select
                    title="select calc type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={calcType}
                    onChange={e => setCalcType(e.target.value)}
                  >
                    <option value="FIXED">Fixo (R$)</option>
                    <option value="PERCENTAGE_BASE">% sobre Salário Base</option>
                    <option value="PERCENTAGE_TOTAL">% sobre Subtotal</option>
                    <option value="TEXT">Campo Descritivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    title="input value"
                    type={calcType === "TEXT" ? "text" : "number"}
                    {...(calcType !== "TEXT" && { step: "0.01" })}
                    placeholder={
                      calcType === "TEXT"
                        ? "Digite uma descrição"
                        : "Ex: 1200.50 ou 10 para 10%"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={value}
                    onChange={e => {
                      setValue(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSaveRule}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" /> Salvar Parametrização
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tabela de Regras Ativas Lateral */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Tabela de Hierarquia de Verbas Ativas
              </h3>

              <div className="relative w-64">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  title="search rules"
                  type="text"
                  placeholder="Buscar regra..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 font-semibold text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4">Verba/Variável</th>
                    <th className="px-6 py-4">Contexto de Aplicação</th>
                    <th className="px-6 py-4">Métrica</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Carregando parâmetros...</td></tr>
                  ) : rules.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma regra ativa encontrada. Use o formulário lateral para criar.</td></tr>
                  ) : (
                    rules.map((r: any) => {
                      const isGlobal = !r.client_id && !r.state_uf;
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-l-4 border-l-transparent hover:border-l-blue-500">
                            {verbaTypes.map((v: any) => (
                              <>{v.id === r.verba_type_id ? v.name : ''}</>
                            ))}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {isGlobal ? (
                              <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold uppercase">Regra Global</span>
                            ) : (
                              <div className="flex flex-col gap-1">
                                {r.client_id && 
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded"><Building2 className="w-3 h-3" />
                                  {clients.map((c: any) => (
                                    <span className=''>{ c.id == r.client_id ? c.client_name : '' }</span>
                                  ))}
                                </span>}
                                {r.state_uf && 
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded"><MapPin className="w-3 h-3" /> 
                                  {r.state_uf}
                                </span>}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {r.calc_type === 'FIXED' && 'R$ Fixo'}
                            {r.calc_type === 'PERCENTAGE_BASE' && '% Sal. Base'}
                            {r.calc_type === 'PERCENTAGE_TOTAL' && '% Sal. Total'}
                            {r.calc_type === 'TEXT' && 'Descritivo'}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {r.calc_type === 'FIXED' ? `R$ ${r.value}` :
                              r.calc_type === 'TEXT' ? r.text_value : `${r.value}%`}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => handleEditClick(r)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Pencil size={18} />
                              </button>
                              <button onClick={() => handleDeleteClick(r.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-[500px] max-w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-600" /> Editar Regra/Verba
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" /> Cliente Específico
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.client_id}
                  onChange={e => setEditForm({ ...editForm, client_id: e.target.value })}
                >
                  <option value="">-- Regra Global (Todos os Clientes) --</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.client_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> Estado/Praça
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.state_uf}
                  onChange={e => setEditForm({ ...editForm, state_uf: e.target.value })}
                >
                  <option value="">-- Regra Global (Todos os Estados) --</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="RJ">Rio de Janeiro (RJ)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Tipo de Verba
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.verba_type_id}
                  onChange={e => setEditForm({ ...editForm, verba_type_id: e.target.value })}
                >
                  <option value="">-- Selecione a Verba --</option>
                  {verbaTypes.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.group?.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-gray-500" /> Natureza do Cálculo
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.calc_type}
                  onChange={e => setEditForm({ ...editForm, calc_type: e.target.value })}
                >
                  <option value="FIXED">Fixo (R$)</option>
                  <option value="PERCENTAGE_BASE">% sobre Salário Base</option>
                  <option value="PERCENTAGE_TOTAL">% sobre Subtotal</option>
                  <option value="TEXT">Campo Descritivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type={editForm.calc_type === "TEXT" ? "text" : "number"}
                  {...(editForm.calc_type !== "TEXT" && { step: "0.01" })}
                  placeholder={editForm.calc_type === "TEXT" ? "Digite uma descrição" : "Ex: 1200.50"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.value}
                  onChange={e => setEditForm({ ...editForm, value: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateRule}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-[400px] max-w-full">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja remover esta regra de verba? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
