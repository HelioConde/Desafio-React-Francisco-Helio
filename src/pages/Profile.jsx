import React from 'react';
import { Link } from 'react-router-dom';
import { isDemo } from '../lib/api.js';

export default function Profile() {
  return <div className="stack"><div className="page-heading"><div><p className="eyebrow">PROJETO DE PORTFÓLIO</p><h1>Sobre o projeto</h1><p>Desafio React originalmente desenvolvido a partir de uma referência da SEA Tecnologia.</p></div></div>
    <section className="panel prose"><h2>Gestão demonstrativa de EPIs</h2><p>Interface de estudo para cadastrar, consultar e gerenciar registros fictícios de funcionários, atividades e equipamentos de proteção individual.</p><p><strong>Modo de dados:</strong> {isDemo ? 'demonstração local com localStorage' : 'JSON Server em desenvolvimento'}.</p><p>Anexos são guardados no IndexedDB deste navegador, sem sincronização. Não há login, autorização, criptografia específica de dados pessoais nem infraestrutura de produção. Este aplicativo não é adequado ao tratamento de dados reais de RH.</p><p>Criado como projeto de estudo e portfólio. Consulte o README do repositório para executar os testes e a API local.</p><Link className="btn btn-outline" to="/">Voltar ao painel</Link></section>
  </div>;
}
