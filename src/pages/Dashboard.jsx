import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserCheck, faHelmetSafety, faTriangleExclamation, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { listEmployees, isDemo } from '../lib/api.js';

export default function Dashboard() {
  const [people, setPeople] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    listEmployees().then((data) => { if (alive) setPeople(data); }).catch((e) => { if (alive) setError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const active = people.filter((p) => p.ativo).length;
  const usingEpi = people.filter((p) => !p.naoUsaEPI && p.atividades.some((a) => a.epis.length)).length;
  const certificates = people.flatMap((p) => p.atividades).flatMap((a) => a.epis).filter((e) => e.ca).length;
  const cards = [
    { title: 'Total de funcionários', value: people.length, icon: faUsers, tone: 'blue' },
    { title: 'Funcionários ativos', value: active, icon: faUserCheck, tone: 'green' },
    { title: 'Com EPIs registrados', value: usingEpi, icon: faHelmetSafety, tone: 'violet' },
    { title: 'CAs cadastrados', value: certificates, icon: faTriangleExclamation, tone: 'amber' },
  ];
  return (
    <div className="stack">
      <div className="page-heading"><div><p className="eyebrow">PAINEL DE CONTROLE</p><h1>Visão geral</h1><p>Acompanhe funcionários e registros de equipamentos de proteção.</p></div><Link className="btn btn-primary" to="/funcionarios/novo">+ Novo funcionário</Link></div>
      {isDemo && <div className="notice notice-info" role="note">Modo demonstração: alterações e anexos ficam somente neste navegador. Não use informações reais.</div>}
      {error && <div className="notice notice-error" role="alert">{error} <button className="link-button" type="button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}
      <div className="stats-grid" aria-busy={loading}>
        {cards.map((card) => <article className="stat-card" key={card.title}><div className={'stat-icon ' + card.tone}><FontAwesomeIcon icon={card.icon} /></div><div><p>{card.title}</p><strong>{loading ? '—' : card.value}</strong></div></article>)}
      </div>
      <div className="dashboard-grid">
        <section className="panel"><div className="panel-heading"><div><h2>Funcionários recentes</h2><p>Registros disponíveis na demonstração</p></div><Link className="text-link" to="/funcionarios">Ver todos <FontAwesomeIcon icon={faArrowRight} /></Link></div>
          {loading ? <p className="muted" role="status">Carregando funcionários…</p> : people.length ? <div className="compact-list">{[...people].sort((a,b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))).slice(0, 5).map((p) => <Link to={'/funcionarios/' + p.id} key={p.id} className="compact-item"><span className="avatar" aria-hidden="true">{p.nome.charAt(0)}</span><span className="compact-name"><strong>{p.nome}</strong><small>{p.cargo}</small></span><span className={'status ' + (p.ativo ? 'status-active' : 'status-inactive')}>{p.ativo ? 'Ativo' : 'Inativo'}</span></Link>)}</div> : <p className="empty-inline">Nenhum funcionário. Cadastre o primeiro.</p>}
        </section>
        <section className="panel guidance"><h2>Como usar</h2><p>Este projeto apresenta um fluxo de cadastro e acompanhamento de funcionários e EPIs.</p><ol><li>Cadastre um funcionário com dados fictícios.</li><li>Registre atividades, equipamentos e CAs.</li><li>Consulte, edite ou remova o registro.</li></ol><Link className="btn btn-outline" to="/funcionarios">Gerenciar funcionários</Link></section>
      </div>
    </div>
  );
}
