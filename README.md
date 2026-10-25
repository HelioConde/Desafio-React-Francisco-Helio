<div align="center">
  <h1>👷 Desafio React — SEA Tecnologia</h1>
  <p><strong>Interface para cadastro de funcionários e acompanhamento de informações de EPI, desenvolvida como desafio técnico.</strong></p>
  <p><img alt="React 18" src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white"> <img alt="Status" src="https://img.shields.io/badge/status-projeto%20de%20estudo-64748b"></p>
  <p><a href="https://www.figma.com/file/gGePjuPTHdH7pISofjrzxB/Desafio-React?node-id=0%3A1"><strong>Protótipo de referência (Figma)</strong></a> · <a href="#como-executar"><strong>Executar localmente</strong></a></p>
</div>

## Sobre

Implementação de um desafio de **desenvolvimento front-end** para a SEA Tecnologia. O objetivo foi traduzir uma referência de design em telas navegáveis usando componentes React, formulários e dados para demonstração.

A estrutura do código inclui páginas para **funcionários, formulários, atividades/EPI, histórico e perfil**. É um projeto de portfólio histórico, e não um sistema empresarial auditado.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React 18 + Create React App | Interface e componentes |
| React Router | Navegação |
| React Hook Form | Estado e validação de formulários |
| React Input Mask | Máscaras de campos |
| Font Awesome | Iconografia |
| JSON Server | API local com dados de exemplo |

## Como executar

Requer Node.js/npm compatíveis com as dependências originais.

```bash
git clone https://github.com/HelioConde/Desafio-React-Francisco-Helio.git
cd Desafio-React-Francisco-Helio
npm install
npm start
```

Abra o endereço indicado pelo React Scripts, normalmente `http://localhost:3000`.

Para experimentar os dados locais, há `db.json` e `data.json` na raiz. Se as páginas precisarem de uma API JSON local, confira as URLs usadas no código e inicie um servidor de dados de teste, por exemplo:

```bash
npx json-server --watch db.json --port 3001
```

**O comando acima é uma opção de desenvolvimento, não uma garantia de que todas as rotas usem essa porta.** Confira a configuração real ao reproduzir o exercício.

## Organização

```text
src/
  App.js             Entrada da aplicação
  NavBar.js          Navegação
  pages/             Funcionários, EPI, formulários, histórico e perfil
  index.js           Montagem do React
public/              Recursos estáticos
db.json, data.json   Dados de exemplo
```

## Limitações e evolução

- Não há homologação de autenticação, permissões por usuário ou proteção de dados reais.
- O projeto usa ferramentas/dependências históricas que podem exigir atualização.
- Melhorias futuras: acessibilidade, testes de formulários, validação do fluxo CRUD e layouts mobile.

> Não utilize informações verdadeiras de funcionários para testar a aplicação.

**Projeto de estudo desenvolvido por [Hélio Conde](https://github.com/HelioConde).**
