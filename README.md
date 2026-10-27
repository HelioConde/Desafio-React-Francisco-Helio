<div align="center">

# 👷 Gestão de Funcionários e EPIs — Desafio React

**Aplicação demonstrativa modernizada a partir de um desafio técnico da SEA Tecnologia.**

React 18 · Vite · JSON Server · Testes Vitest e Playwright

[Referência de design no Figma](https://www.figma.com/file/gGePjuPTHdH7pISofjrzxB/Desafio-React?node-id=0%3A1) · [Guia visual](docs/DESIGN_SYSTEM.md)

</div>

## Funcionalidades

- Dashboard com funcionários totais, ativos, com EPI e CAs cadastrados.
- CRUD completo de funcionários: criar, consultar, editar e excluir com confirmação.
- Pesquisa por nome/cargo/status; filtros combinados, ordenação e paginação.
- Formulário com validação de CPF, campos obrigatórios, atividades, EPIs e CA.
- Anexos PDF/PNG/JPG de até 2 MB salvos localmente em IndexedDB.
- Histórico de modificações no navegador e página informativa.
- Menu responsivo, foco visível, rótulos acessíveis e movimento reduzido.

> **Atenção:** projeto de estudo. Use apenas dados fictícios. Não há autenticação, controle de acesso ou backend seguro para informações reais de RH.

## Execução local (com API JSON Server)

Requer Node.js **22** e npm.

```bash
npm install
npm run dev:api
```

Em outro terminal:

```bash
npm run dev
```

Abra `http://localhost:5173`. O Vite redireciona `/api/data` ao JSON Server local na porta 3001, que persiste alterações no `data.json`.

## Demonstração estática (sem servidor ou banco)

```bash
npm run build
npm run preview
```

O build de produção usa **localStorage** para os cadastros fictícios e **IndexedDB** para os anexos; os dados ficam restritos a cada navegador. O workflow de GitHub Pages configura o caminho do repositório e utiliza `HashRouter` para navegação sem servidor.

O endereço esperado após o deploy é **https://helioconde.github.io/Desafio-React-Francisco-Helio/**.

Para publicar, configure em **Settings → Pages → Build and deployment → GitHub Actions**, mantenha a branch `main` como base e execute `GitHub Pages • Publicação React` (ou faça push para `main`). O workflow constrói a versão do Vite com o subcaminho correto, publica `dist/` e testa a URL pública.

**Atenção:** se o workflow concluir antes de receber runner (`runner_id: 0` / `steps: []`), verifique as permissões de Actions, o estado de faturamento/cotas e eventuais bloqueios do GitHub. Alterar os arquivos do repositório não resolve por si só falhas de provisionamento de runner.

## Qualidade e testes

```bash
npm run lint
npm run test:unit
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia o Vite automaticamente com `npm run dev:demo`, sem modificar `data.json`. Verifica CRUD, filtros, anexos, persistência e layout. Para a auditoria completa:

```bash
npm run test:visual
```

O comando fotografa sete telas em **320×720, 375×812, 768×1024, 1024×768 e 1600×900**, avalia console e exceções JavaScript, requisições falhadas e problemas de layout. Depois, abra `test-results/visual-audit/index.html`. Mais detalhes em [Auditoria visual automatizada](docs/VISUAL_QA.md). O GitHub Actions anexa capturas e relatórios a cada execução.

**Observação:** as capturas só representam o estado real após a execução dos testes; não há imagens ilustrativas simulando a aplicação no README.

## Estrutura

```text
src/
  components/         Layout e formulário reutilizável
  data/               Dados fictícios para demo estática
  lib/                API, normalização, validação, anexos e histórico
  pages/              Dashboard, listagem, detalhes, histórico e perfil
  App.jsx             Rotas da aplicação
  styles.css          Tokens e estilos responsivos
e2e/                   Testes Playwright
docs/DESIGN_SYSTEM.md  Guia visual e acessibilidade
.github/workflows/      CI e publicação Pages
data.json              API local para desenvolvimento
```

## Origem

Projeto histórico de portfólio criado por [Hélio Conde](https://github.com/HelioConde). O Figma original é a referência conceitual, mas a verificação automatizada de fidelidade depende de acesso ao arquivo.
