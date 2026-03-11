import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Budgets from './pages/Budgets';
import BudgetsCreate from './pages/BudgetsCreate';
import RulesEngine from './pages/RulesEngine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/budgets/new" element={<BudgetsCreate />} />
        <Route path="/rules-engine" element={<RulesEngine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
