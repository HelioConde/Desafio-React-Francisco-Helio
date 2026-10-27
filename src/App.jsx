import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import EmployeeDetail from './pages/EmployeeDetail.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="funcionarios" element={<Employees />} />
          <Route path="funcionarios/novo" element={<EmployeeForm />} />
          <Route path="funcionarios/:id" element={<EmployeeDetail />} />
          <Route path="funcionarios/:id/editar" element={<EmployeeForm />} />
          <Route path="historico" element={<History />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="Home" element={<Navigate to="/" replace />} />
          <Route path="Employee" element={<Navigate to="/funcionarios" replace />} />
          <Route path="Historic" element={<Navigate to="/historico" replace />} />
          <Route path="User" element={<Navigate to="/perfil" replace />} />
          <Route path="*" element={<section className="panel empty"><h1>Página não encontrada</h1><p>Verifique o endereço ou retorne ao painel.</p></section>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
