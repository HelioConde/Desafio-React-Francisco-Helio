import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../lib/history.js';

export default function History() {
  const [entries] = useState(getHistory);
  return <div className="stack"><div className="page-heading"><div><p className="eyebrow">ATIVIDADE LOCAL</p><h1>Histórico</h1><p>Operações desta demonstração, registradas somente no seu navegador.</p></div></div>
    <section className="panel"><h2>Movimentações recentes</h2>{entries.length ? <ul className="timeline">{entries.map((entry) => <li key={entry.id}><strong>{entry.action}</strong><span>{entry.employee}</span><time dateTime={entry.when}>{new Date(entry.when).toLocaleString('pt-BR')}</time></li>)}</ul> : <div className="empty-inline"><p>Ainda não existem movimentações.</p><Link className="btn btn-outline" to="/funcionarios">Gerenciar funcionários</Link></div>}</section>
  </div>;
}
