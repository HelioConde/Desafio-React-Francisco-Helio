import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faUsers, faClockRotateLeft, faCircleUser, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { isDemo } from '../lib/api.js';

const navigation = [
  { to: '/', label: 'Visão geral', icon: faChartColumn, end: true },
  { to: '/funcionarios', label: 'Funcionários', icon: faUsers },
  { to: '/historico', label: 'Histórico', icon: faClockRotateLeft },
  { to: '/perfil', label: 'Sobre o projeto', icon: faCircleUser },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current = navigation.find((item) => item.end ? location.pathname === '/' : location.pathname.startsWith(item.to));
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo" onClick={(event) => { event.preventDefault(); document.getElementById("conteudo")?.focus(); }}>Pular para o conteúdo</a>
      <aside className={'sidebar ' + (menuOpen ? 'sidebar-open' : '')} aria-label="Menu principal">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true"><img src={import.meta.env.BASE_URL + "favicon.svg"} alt="" width="42" height="42" /></div>
          <div><strong>SEA • Gestão EPI</strong><span>Desafio React</span></div>
          <button className="icon-btn mobile-only close-menu" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <nav className="nav-list" aria-label="Navegação principal">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FontAwesomeIcon icon={item.icon} fixedWidth aria-hidden="true" /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom"><span className="status-dot" /> {isDemo ? 'Demonstração local' : 'API JSON Server'}<small>Não utilize dados pessoais reais.</small></div>
      </aside>
      {menuOpen && <button className="menu-overlay" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
      <div className="main-column">
        <header className="topbar">
          <button className="icon-btn mobile-only" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><FontAwesomeIcon icon={faBars} /></button>
          <span className="breadcrumb">Gestão de EPIs <span aria-hidden="true">/</span> <strong>{current?.label || 'Funcionários'}</strong></span>
          <span className="topbar-tag">Projeto demonstrativo</span>
        </header>
        <main className="page-content" id="conteudo" tabIndex="-1"><Outlet /></main>
        <footer className="footer">Desafio React • SEA Tecnologia — ambiente de demonstração com dados fictícios</footer>
      </div>
    </div>
  );
}
