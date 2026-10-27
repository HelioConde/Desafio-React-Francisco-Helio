import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faHelmetSafety, faShieldHalved, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { isDemo } from '../lib/api.js';

const features = [
  { title: 'Funcionários', description: 'Cadastre, edite, filtre e consulte registros fictícios.', icon: faUserGear },
  { title: 'Atividades e EPIs', description: 'Organize equipamentos e certificados de aprovação (CA).', icon: faHelmetSafety },
  { title: 'Privacidade da demo', description: 'Dados locais neste navegador, sem contas ou sincronização.', icon: faShieldHalved },
];

export default function Profile() {
  return (
    <div className="stack profile-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROJETO DE PORTFÓLIO</p>
          <h1>Sobre o projeto</h1>
          <p>Uma versão modernizada do desafio React baseado na referência da SEA Tecnologia.</p>
        </div>
        <Link className="btn btn-outline" to="/">Voltar ao painel</Link>
      </div>
      <section className="panel prose">
        <h2>Gestão demonstrativa de funcionários e EPIs</h2>
        <p>Interface para explorar cadastros, atividades e equipamentos de proteção individual com dados de exemplo.</p>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-item" key={feature.title}>
              <div className="feature-icon" aria-hidden="true"><FontAwesomeIcon icon={feature.icon} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
        <div className="about-foot">
          <p><strong>Modo atual:</strong> {isDemo ? 'demonstração local com localStorage' : 'JSON Server em ambiente de desenvolvimento'}. Anexos permanecem no IndexedDB deste navegador.</p>
          <p><strong>Importante:</strong> este projeto não possui autenticação, autorização nem infraestrutura adequada para dados pessoais reais de RH.</p>
          <a className="text-link" href="https://github.com/HelioConde/Desafio-React-Francisco-Helio" target="_blank" rel="noopener noreferrer">Ver código e instruções no GitHub <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
        </div>
      </section>
    </div>
  );
}
