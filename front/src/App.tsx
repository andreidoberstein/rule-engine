import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Users from './pages/Users';
import Budgets from './pages/Budgets';
import BudgetsCreate from './pages/BudgetsCreate';
import RulesEngine from './pages/RulesEngine';
import AuditLogs from './pages/AuditLogs';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/users" element={<Users />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/budgets/new" element={<BudgetsCreate />} />
        <Route path="/rules-engine" element={<RulesEngine />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
