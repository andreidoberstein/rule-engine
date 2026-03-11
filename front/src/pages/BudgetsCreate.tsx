import { useState, useEffect } from 'react';
import { Building2, Users, Target, Plus, Trash2, Calculator, CheckCircle2, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '../components/Layout';

interface BudgetRole {
  role_id: string;
  role_name: string;
  area_id: string;
  area_name: string;
  state_uf: string;
  headcount: number;
}

export default function BudgetsCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clients, setClients] = useState([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
  
  const [selectedClient, setSelectedClient] = useState('');
  
  const [budgetRoles, setBudgetRoles] = useState<BudgetRole[]>([]);
  const [tempAreaId, setTempAreaId] = useState('');
  const [tempRoleId, setTempRoleId] = useState('');
  const [tempState, setTempState] = useState('');
  const [verbaTypes, setVerbaTypes] = useState([]);
  const [tempHeadcount, setTempHeadcount] = useState(1);

  const [simulatedData, setSimulatedData] = useState<any[]>([]);
  const [budgetTotal, setBudgetTotal] = useState<number>(0);

  const [editingVerba, setEditingVerba] = useState<{roleIdx: number, verbaIdx: number} | null>(null);
  const [editVerbaForm, setEditVerbaForm] = useState({ base_calc_type: '', base_value: 0 });

  useEffect(() => {
    fetch('http://localhost:3000/clients?take=50')
      .then(res => res.json())
      .then(data => setClients(data.data || []))
      .catch(() => toast.error('Erro ao carregar clientes'));

    fetch('http://localhost:3000/budgets/reference-data')
      .then(res => res.json())
      .then(data => {
        setAreas(data.areas || []);
        setRolesList(data.roles || []);
      })
    fetch('http://localhost:3000/budgets/verba-types')
      .then(res => res.json())
      .then(data => setVerbaTypes(data || []))
      .catch(() => toast.error('Erro ao carregar tipos de verbas'));
  }, []);

  const handleAddRole = () => {
    if (!tempRoleId || !tempState || tempHeadcount < 1) {
      toast.error('Selecione Cargo, Estado e Quantidade de Vagas');
      return;
    }
    const roleObj = rolesList.find(r => r.id === tempRoleId);
    const areaObj = areas.find(a => a.id === roleObj?.area_id);

    setBudgetRoles(prev => [...prev, {
      role_id: roleObj.id,
      role_name: roleObj.name,
      area_id: areaObj.id,
      area_name: areaObj.name,
      state_uf: tempState,
      headcount: tempHeadcount
    }]);

    setTempRoleId('');
    setTempState('');
    setTempHeadcount(1);
  };

  const handleRemoveRole = (index: number) => {
    setBudgetRoles(prev => prev.filter((_, i) => i !== index));
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        client_id: selectedClient,
        roles: budgetRoles.map(r => ({
          role_id: r.role_id,
          state_uf: r.state_uf,
          headcount: r.headcount
        }))
      };

      const res = await fetch('http://localhost:3000/budgets/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setSimulatedData(data);

      let total = 0;
      data.forEach((r: any) => {
        r.verbas?.forEach((v: any) => {
          if (v.calc_type === 'FIXED') {
            total += v.total_calculated;
          }
        });
      });
      setBudgetTotal(total);

      setStep(3);
    } catch (e) {
      toast.error('Falha ao simular cálculos do orçamento');
    } finally {
      setIsSimulating(false);
    }
  };

  const calculateTotal = (data: any[]) => {
    let total = 0;
    data.forEach((r: any) => {
      r.verbas?.forEach((v: any) => {
        if (v.calc_type === 'FIXED' || v.base_calc_type === 'FIXED') {
          total += v.total_calculated;
        }
      });
    });
    setBudgetTotal(total);
  };

  const handleEditVerba = (roleIdx: number, verbaIdx: number, verba: any) => {
    setEditingVerba({ roleIdx, verbaIdx });
    setEditVerbaForm({ 
      base_calc_type: verba.base_calc_type || verba.calc_type, 
      base_value: verba.base_value 
    });
  };

  const saveVerbaEdit = () => {
    if (!editingVerba) return;
    
    const newData = [...simulatedData];
    const role = newData[editingVerba.roleIdx];
    const verba = role.verbas[editingVerba.verbaIdx];
    
    verba.base_calc_type = editVerbaForm.base_calc_type;
    verba.calc_type = editVerbaForm.base_calc_type;
    verba.base_value = Number(editVerbaForm.base_value);
    
    if (verba.base_calc_type === 'FIXED') {
      verba.total_calculated = verba.base_value * role.headcount;
    } else {
      verba.total_calculated = verba.base_value; // Simplification for percentages
    }
    
    setSimulatedData(newData);
    calculateTotal(newData);
    setEditingVerba(null);
  };

  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      const payload = {
        client_id: selectedClient,
        status: 'DRAFT',
        dates: '2024 - 2025',
        total: budgetTotal,
        roles: simulatedData.map(roleData => ({
          role_id: roleData.role_id,
          state_uf: roleData.state_uf,
          headcount: roleData.headcount,
          verbas: roleData.verbas.map((v: any) => ({
            verba_type_id: v.verba_type_id,
            base_calc_type: v.base_calc_type || v.calc_type,
            base_value: v.base_value,
            calc_type: v.calc_type,
            value: v.total_calculated || v.base_value
          }))
        }))
      };

      const res = await fetch('http://localhost:3000/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Orçamento salvo com sucesso!');
        navigate('/budgets');
      } else {
        const err = await res.json();
        toast.error('Erro ao salvar: ' + JSON.stringify(err));
      }
    } catch (e) {
      toast.error('Erro de conexão');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevStep = () => setStep(prev => prev - 1);

  return (
    <Layout title="Novo Orçamento" subtitle="Siga o assistente para parametrizar um novo orçamento">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        
        <div className="border-b border-gray-100 px-8 py-6 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Cliente</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className={`text-sm font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Estrutura & Praças</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className={`text-sm font-semibold ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Verbas & Fechamento</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 min-h-[400px]">
          
          {step === 1 && (
            <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                  <Building2 className="text-blue-600" /> Selecione o Cliente
                </h3>
                <p className="text-gray-500 mt-2">Escolha para qual cliente este orçamento será gerado.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente Ativo</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.client_name} ({c.document})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in max-w-5xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Target className="text-blue-600" /> Estrutura da Operação
                </h3>
                <p className="text-gray-500 mt-2">Defina as áreas, cargos e as praças de atuação.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Área (Filtro)</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded-md text-sm" value={tempAreaId} onChange={e => setTempAreaId(e.target.value)}>
                      <option value="">Todas</option>
                      {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cargo</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded-md text-sm" value={tempRoleId} onChange={e => setTempRoleId(e.target.value)}>
                      <option value="">Selecione o Cargo...</option>
                      {rolesList.filter(r => !tempAreaId || r.area_id === tempAreaId).map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({areas.find(a=>a.id === r.area_id)?.name})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Praça (UF)</label>
                    <select className="w-full p-2.5 border border-gray-300 rounded-md text-sm" value={tempState} onChange={e => setTempState(e.target.value)}>
                      <option value="">Estado...</option>
                      <option value="SP">SP</option><option value="RJ">RJ</option><option value="MG">MG</option><option value="PR">PR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vagas</label>
                    <input type="number" min="1" className="w-full p-2.5 border border-gray-300 rounded-md text-sm" value={tempHeadcount} onChange={e => setTempHeadcount(parseInt(e.target.value))} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={handleAddRole} className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-800">
                    <Plus className="w-4 h-4" /> Adicionar Vaga
                  </button>
                </div>
              </div>

              {budgetRoles.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-600">Área</th>
                        <th className="px-6 py-3 font-semibold text-gray-600">Cargo</th>
                        <th className="px-6 py-3 font-semibold text-gray-600 text-center">Praça</th>
                        <th className="px-6 py-3 font-semibold text-gray-600 text-center">Vagas (HC)</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {budgetRoles.map((role, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 text-gray-500">{role.area_name}</td>
                          <td className="px-6 py-3 font-medium text-gray-900">{role.role_name}</td>
                          <td className="px-6 py-3 text-center"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium text-xs">{role.state_uf}</span></td>
                          <td className="px-6 py-3 text-center font-bold text-gray-700">{role.headcount}</td>
                          <td className="px-6 py-3 text-right">
                            <button onClick={() => handleRemoveRole(idx)} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                  <Users className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                  <p>A estrutura está vazia. Adicione os cargos e as praças acima.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in max-w-5xl mx-auto">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <CheckCircle2 className="text-blue-600" /> Simulação & Fechamento
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm max-w-xl">
                    Baseado no Motor de Regras, a simulação importou todas as verbas das praças selecionadas e multiplicou pelo número de vagas.
                  </p>
                </div>
                <div className="text-right bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">Custo Direto Estimado</p>
                  <p className="text-3xl font-black text-blue-900">R$ {budgetTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {simulatedData.map((roleData: any, i: number) => {
                const roleObj = rolesList.find(r => r.id === roleData.role_id);
                return (
                  <div key={i} className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-800 text-white px-5 py-3 flex justify-between items-center">
                      <div className="font-semibold">{roleObj?.name || 'Cargo'} <span className="text-gray-400 text-sm font-normal">| Praça: {roleData.state_uf}</span></div>
                      <div className="bg-gray-700 px-3 py-1 rounded text-sm font-medium">{roleData.headcount} Vagas</div>
                    </div>
                    
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-5 py-2 font-medium">Tipo de Verba</th>
                          <th className="px-5 py-2 font-medium">Métrica Motor de Regras</th>
                          <th className="px-5 py-2 font-medium text-right">Subtotal Aplicado (Verba x Vagas)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                       
                        {roleData.verbas?.map((v: any, j: number) => {
                          const isEditing = editingVerba?.roleIdx === i && editingVerba?.verbaIdx === j;
                          
                          return (
                          <tr key={j} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-900">
                              {verbaTypes.map((vt: any) => (
                                vt.id === v.verba_type_id ? vt.name : ''
                              ))}
                            </td>
                            <td className="px-5 py-3 text-gray-500">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <select 
                                    className="border rounded px-2 py-1 text-sm"
                                    value={editVerbaForm.base_calc_type}
                                    onChange={e => setEditVerbaForm({...editVerbaForm, base_calc_type: e.target.value})}
                                  >
                                    <option value="FIXED">Fixo</option>
                                    <option value="PERCENTAGE_BASE">% Base</option>
                                  </select>
                                  <input 
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm w-24"
                                    value={editVerbaForm.base_value}
                                    onChange={e => setEditVerbaForm({...editVerbaForm, base_value: Number(e.target.value)})}
                                  />
                                </div>
                              ) : (
                                (v.base_calc_type || v.calc_type) === 'FIXED' ? `Fixo (R$ ${v.base_value})` : `${v.base_value}% (Dinâmico)`
                              )}
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-gray-900 group relative">
                              <div className="flex items-center justify-end gap-3">
                                <span>
                                  {(v.base_calc_type || v.calc_type) === 'FIXED' ? `R$ ${v.total_calculated.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : '-'}
                                </span>
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={saveVerbaEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingVerba(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded"><X className="w-4 h-4" /></button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleEditVerba(i, j, v)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
                                    title="Editar Regra"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                )
              })}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={step === 1 || isSimulating || isSaving}
            className="px-6 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Voltar
          </button>
          
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              disabled={!selectedClient}
              className="px-6 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Avançar Etapa
            </button>
          )}

          {step === 2 && (
            <button
              onClick={runSimulation}
              disabled={budgetRoles.length === 0 || isSimulating}
              className="px-6 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSimulating ? 'Simulando Requisitos...' : 'Simular Verbas no Motor'}
              {!isSimulating && <Calculator className="w-4 h-4" />}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSaveBudget}
              disabled={isSaving}
              className="px-8 py-2.5 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-md transition-all flex items-center gap-2"
            >
              {isSaving ? 'Salvando...' : 'Finalizar & Salvar Orçamento'}
            </button>
          )}
        </div>

      </div>
    </Layout>
  );
}
