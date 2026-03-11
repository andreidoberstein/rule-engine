import type { ReactNode } from 'react';
import {
  BarChart3,
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  ShieldAlert,
  Settings,
  MenuSquare,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] text-gray-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">AdminPanel</span>
        </div>

        <div className="px-6 py-4">
          <span className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Menu Principal</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-md transition-colors group ${
              isActive('/dashboard') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} className={isActive('/dashboard') ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'} />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/clients')}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-md transition-colors group ${
              isActive('/clients') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Users size={18} className={isActive('/clients') ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'} />
            <span className="font-medium text-sm">Clientes</span>
          </button>
          
          <Link to="/budgets" className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
            <FileText size={18} className="text-gray-400 group-hover:text-gray-300" />
            <span className="font-medium text-sm">Orçamentos</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
            <DollarSign size={18} className="text-gray-400 group-hover:text-gray-300" />
            <span className="font-medium text-sm">Fechamentos</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
            <ShieldAlert size={18} className="text-gray-400 group-hover:text-gray-300" />
            <span className="font-medium text-sm">Benefícios</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
            <Users size={18} className="text-gray-400 group-hover:text-gray-300" />
            <span className="font-medium text-sm">Usuários</span>
          </a>
          <Link to="/rules-engine" className="flex items-center justify-between px-2 py-2.5 hover:bg-gray-800 hover:text-white rounded-md transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400 group-hover:text-gray-300" />
              <span className="font-medium text-sm">Configuração</span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MenuSquare size={20} className="text-gray-400 lg:hidden cursor-pointer" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Olá, {user.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">Sair</button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-[#111827] mb-1">{title}</h1>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            {/* Context action slot could go here if needed as a prop */}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
