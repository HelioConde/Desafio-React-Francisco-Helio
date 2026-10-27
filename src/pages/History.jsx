import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faArrowRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { getHistory } from '../lib/history.js';

export default function History() {
  const [entries] = useState(getHistory);
  return (
    <div className="stack history-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ATIVIDADE LOCAL</p>
          <h1>Histórico</h1>
          <p>Acompanhe os cadastros, alterações e exclusões realizados neste navegador.</p>
        </div>
        <Link className="btn btn-outline" to="/funcionarios">Ver funcionários</Link>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div><h2>Movimentações recentes</h2><p>{entries.length} registro(s) de atividade</p></div>
        </div>
        {entries.length ? (
          <ul className="timeline" aria-label="Movimentações registradas">
            {entries.map((entry) => (
              <li key={entry.id}>
                <span className="timeline-mark" aria-hidden="true"><FontAwesomeIcon icon={faClockRotateLeft} /></span>
                <strong>{entry.action}</strong>
                <span>{entry.employee}</span>
                <time dateTime={entry.when}>{new Date(entry.when).toLocaleString('pt-BR')}</time>
              </li>
            ))}
          </ul>
        ) : (
          <div className="history-empty">
            <div className="empty-illustration" aria-hidden="true"><FontAwesomeIcon icon={faClockRotateLeft} /></div>
            <div>
              <h3>Nenhuma movimentação ainda</h3>
              <p>Ao cadastrar, editar ou excluir um funcionário de demonstração, a ação será exibida aqui.</p>
              <Link className="btn btn-primary" to="/funcionarios">Gerenciar funcionários <FontAwesomeIcon icon={faArrowRight} /></Link>
            </div>
          </div>
        )}
      </section>
      <p className="history-help"><FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" /> Este histórico fica somente no armazenamento local e não é um registro de auditoria para uso empresarial.</p>
    </div>
  );
}
