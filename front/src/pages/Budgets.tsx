import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle2, Clock, ClipboardList, X, Edit2, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '../components/Layout';

export default function Budgets() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editableBudget, setEditableBudget] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  
  const [editingVerba, setEditingVerba] = useState<{ roleIndex: number; verbaIndex: number } | null>(null);
  const [editVerbaForm, setEditVerbaForm] = useState({ base_calc_type: 'FIXED', base_value: 0 });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvingBudget, setApprovingBudget] = useState<any>(null);

  const fetchBudgets = () => {
    setIsLoading(true);
    fetch('http://localhost:3000/budgets?take=10')
      .then(res => res.json())
      .then(data => setBudgets(data.data || []))
      .catch(() => toast.error('Erro ao buscar orçamentos'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const openDetailsModal = async (id: string) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`http://localhost:3000/budgets/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEditableBudget(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    } catch {
      toast.error('Erro ao buscar detalhes do orçamento');
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!user?.id) return toast.error('Usuário não autenticado.');
    try {
      const res = await fetch(`http://localhost:3000/budgets/${deletingBudget.id}?user_id=${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Orçamento removido com sucesso!');
        setIsDeleteModalOpen(false);
        fetchBudgets();
      } else {
        toast.error('Erro ao remover orçamento.');
      }
    } catch {
      toast.error('Erro ao remover orçamento.');
    }
  };

  const handleApproveSubmit = async () => {
    if (!user?.id) return toast.error('Usuário não autenticado.');
    try {
      const res = await fetch(`http://localhost:3000/budgets/${approvingBudget.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'APPROVED', user_id: user.id })
      });
      if (res.ok) {
        toast.success('Orçamento aprovado com sucesso!');
        setIsApproveModalOpen(false);
        fetchBudgets();
      } else {
        toast.error('Erro ao aprovar orçamento.');
      }
    } catch {
      toast.error('Erro ao aprovar orçamento.');
    }
  };

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
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Criado por</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
                <th className="px-6 py-4">D. Criação</th>
                <th className="px-6 py-4">Últ. Atualização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Carregando orçamentos...
                  </td>
                </tr>
              ) : budgets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-600 font-medium">Nenhum orçamento encontrado</p>
                      <p className="text-sm text-gray-400 mt-1">Crie o seu primeiro orçamento clicando no botão acima.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                budgets.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold border-l-4 border-l-transparent hover:border-l-blue-500">
                      {b.client?.client_name || 'Cliente Removido'}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[120px] truncate" title={b.created_by?.name || 'Sistema'}>
                      {b.created_by?.name || 'Sistema'}
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
                          <Clock className="w-3.5 h-3.5" /> Aguardando aprovação
                        </span>
                      )}
                      {b.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetailsModal(b.id)} className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-50" title="Detalhes do Orçamento">
                          <ClipboardList className="w-4 h-4" />
                        </button>
                        {b.status === 'DRAFT' && (
                          <button onClick={() => { setApprovingBudget(b); setIsApproveModalOpen(true); }} className="text-green-600 hover:text-green-800 transition-colors p-1.5 rounded-md hover:bg-green-50" title="Aprovar Orçamento">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => { setDeletingBudget(b); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-md hover:bg-red-50" title="Remover">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(b.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(b.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> 
                Detalhes do Orçamento
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditingVerba(null); }} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingDetails ? (
                <div className="text-center py-12 text-gray-500">Fazendo download do demonstrativo...</div>
              ) : editableBudget ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 text-sm max-w-md">
                    <div className="text-gray-500 mb-1">Cliente:</div>
                    <div className="font-semibold">{editableBudget.client?.client_name}</div>
                    
                    <div className="text-gray-500 mb-1">Status:</div>
                    <div className="font-semibold">{editableBudget.status}</div>

                    <div className="text-gray-500 mb-1">Custo Total:</div>
                    <div className="font-bold text-blue-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(editableBudget.total)}</div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 border-b pb-2 flex justify-between items-center">
                      Demonstrativo Interativo de Cargos e Verbas
                      <span className="text-xs font-normal text-gray-400">Edite as verbas online</span>
                    </h4>
                    
                    {editableBudget.roles?.length > 0 ? editableBudget.roles.map((r: any, rIndex: number) => (
                      <div key={rIndex} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 text-white px-4 py-2 text-sm flex justify-between items-center">
                          <span className="font-semibold">{r.role?.name} (Praça: {r.state_uf})</span>
                          <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">{r.headcount} Vagas</span>
                        </div>
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 font-medium text-gray-500 w-1/3">Verba</th>
                              <th className="px-4 py-2 font-medium text-gray-500 w-1/3">Regra Aplicada</th>
                              <th className="px-4 py-2 font-medium text-gray-500 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {r.verbas?.map((v: any, vIndex: number) => (
                              <tr key={vIndex}>
                                <td className="px-4 py-2">{v.verba_type?.name}</td>
                                <td className="px-4 py-2">
                                  {editingVerba?.roleIndex === rIndex && editingVerba?.verbaIndex === vIndex ? (
                                    <div className="flex items-center gap-2">
                                      <select
                                        className="text-xs border rounded p-1 w-24"
                                        value={editVerbaForm.base_calc_type}
                                        onChange={(e) => setEditVerbaForm(prev => ({ ...prev, base_calc_type: e.target.value }))}
                                      >
                                        <option value="FIXED">R$ Fixo</option>
                                        <option value="PERCENTAGE_BASE">% Base</option>
                                      </select>
                                      <input
                                        type="number"
                                        step="0.01"
                                        className="text-xs border rounded p-1 w-20"
                                        value={editVerbaForm.base_value}
                                        onChange={(e) => setEditVerbaForm(prev => ({ ...prev, base_value: parseFloat(e.target.value) || 0 }))}
                                        autoFocus
                                      />
                                      <button 
                                        className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                                        onClick={() => {
                                          const newData = [...editableBudget.roles];
                                          const verba = newData[rIndex].verbas[vIndex];
                                          verba.base_calc_type = editVerbaForm.base_calc_type;
                                          verba.calc_type = editVerbaForm.base_calc_type;
                                          verba.base_value = Number(editVerbaForm.base_value);
                                          
                                          if (verba.base_calc_type === 'FIXED') {
                                            verba.value = verba.base_value * r.headcount;
                                          } else {
                                            verba.value = verba.base_value; // percent simplifictation
                                          }
                                          
                                          // Recalculate total budget
                                          let newTotal = 0;
                                          newData.forEach(role => {
                                            role.verbas.forEach((verbaItem: any) => {
                                              newTotal += Number(verbaItem.value);
                                            });
                                          });

                                          setEditableBudget({ ...editableBudget, roles: newData, total: newTotal });
                                          setEditingVerba(null);
                                        }}
                                      >OK</button>
                                    </div>
                                  ) : (
                                    <div 
                                      className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 px-2 py-1 -mx-2 rounded"
                                      onClick={() => {
                                        setEditingVerba({ roleIndex: rIndex, verbaIndex: vIndex });
                                        setEditVerbaForm({ 
                                          base_calc_type: v.base_calc_type || 'FIXED', 
                                          base_value: Number(v.base_value) 
                                        });
                                      }}
                                    >
                                      <span className="text-gray-500">
                                        {v.base_calc_type === 'FIXED' ? `Fixo (R$ ${Number(v.base_value).toLocaleString('pt-BR')})` : `${Number(v.base_value)}%`}
                                      </span>
                                      <Edit2 className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-right font-medium text-gray-900">
                                  R$ {Number(v.value || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">Estrutura não encontrada para este orçamento antigo.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500">Erro ao carregar dados do orçamento.</div>
              )}
            </div>
            {editableBudget && (
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
                  disabled={isSavingChanges}
                >
                  Cancelar
                </button>
                <button 
                  onClick={async () => {
                    if (!user?.id) return toast.error('Usuário não autenticado.');
                    setIsSavingChanges(true);
                    try {
                      // Formatting payload identical to create logic, matching what backend update expects
                      const payload = {
                        user_id: user.id,
                        total: editableBudget.total,
                        roles: editableBudget.roles.map((r: any) => ({
                          role_id: r.role_id,
                          state_uf: r.state_uf,
                          headcount: r.headcount,
                          verbas: r.verbas.map((v: any) => ({
                            verba_type_id: v.verba_type_id,
                            base_calc_type: v.base_calc_type || v.calc_type,
                            base_value: Number(v.base_value),
                            calc_type: v.calc_type,
                            value: Number(v.value)
                          }))
                        }))
                      };

                      const res = await fetch(`http://localhost:3000/budgets/${editableBudget.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      
                      if (res.ok) {
                        toast.success('Alterações salvas com sucesso!');
                        setIsModalOpen(false);
                        fetchBudgets();
                      } else throw new Error();
                    } catch {
                      toast.error('Ocorreu um erro ao salvar alterações.');
                    } finally {
                      setIsSavingChanges(false);
                    }
                  }} 
                  disabled={isSavingChanges}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {isSavingChanges ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remover Orçamento?</h3>
            <p className="text-gray-500 text-sm mb-6">Esta ação removerá o orçamento da listagem e gerará um log de exclusão. Deseja continuar?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg">Cancelar</button>
              <button onClick={handleDeleteSubmit} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">Sim, remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6 border-t-4 border-green-500">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aprovar Orçamento?</h3>
            <p className="text-gray-500 text-sm mb-6">Realmente deseja aprovar o orçamento? Esta ação atualizará o status e o histórico do documento.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { setIsApproveModalOpen(false); setApprovingBudget(null); }} 
                className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleApproveSubmit} 
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition-colors"
              >
                Sim, aprovar
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
