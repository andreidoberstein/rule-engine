import { useState, useEffect } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<string[]>([]); // Stack of cursors for "Previous"
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    is_active: true
  });

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    is_active: true
  });

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const fetchUsers = async (cursor: string | null) => {
    try {
      setIsLoading(true);
      const url = new URL('http://localhost:3000/users');
      url.searchParams.append('take', '5');
      if (cursor) {
        url.searchParams.append('cursor', cursor);
      }

      const response = await fetch(url.toString());
      const res = await response.json();
      
      setUsers(res.data);
      setNextCursor(res.nextCursor);
    } catch (error) {
      toast.error('Erro ao buscar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setCreateForm({ name: '', email: '', password: '', role: 'USER', is_active: true });
        fetchUsers(null); // Reset to first page
        toast.success('Usuário criado com sucesso!');
      } else {
        const err = await res.json();
        toast.error('Erro ao criar: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao criar usuário.');
    }
  };

  useEffect(() => {
    fetchUsers(currentCursor);
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

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers(currentCursor);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const err = await res.json();
        toast.error('Erro ao atualizar: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao atualizar usuário.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDeleteId) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${userToDeleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchUsers(currentCursor);
        toast.success('Usuário excluído com sucesso!');
      } else {
        const err = await res.json();
        toast.error('Erro ao excluir: ' + (err.message || 'Desconhecido'));
      }
    } catch (e) {
      toast.error('Erro de conexão ao excluir usuário.');
    }
  };

  return (
    <Layout 
      title="Usuários" 
      subtitle="Gerencie os usuários do sistema"
    >
      <div className="absolute top-[108px] right-8">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar usuário..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${user.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEditClick(user)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="text-gray-400 hover:text-red-600 transition-colors">
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

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-semibold text-gray-900">{users.length}</span> registros
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

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-[500px] max-w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-blue-600 text-2xl font-normal leading-none">+</span> Novo Usuário
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={createForm.name}
                  onChange={e => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={createForm.email}
                  onChange={e => setCreateForm({...createForm, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha*</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={createForm.password}
                  onChange={e => setCreateForm({...createForm, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={createForm.role}
                  onChange={e => setCreateForm({...createForm, role: e.target.value})}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveNewUser"
                  checked={createForm.is_active}
                  onChange={e => setCreateForm({...createForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActiveNewUser" className="text-sm font-medium text-gray-700">Usuário Ativo</label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-[500px] max-w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-600" /> Editar Usuário
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={editForm.role}
                  onChange={e => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveUser"
                  checked={editForm.is_active}
                  onChange={e => setEditForm({...editForm, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActiveUser" className="text-sm font-medium text-gray-700">Usuário Ativo</label>
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
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-[400px] max-w-full">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
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
