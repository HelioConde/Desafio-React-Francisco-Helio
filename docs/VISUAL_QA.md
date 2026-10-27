# QA visual automatizado e capturas do Playwright

O arquivo `e2e/visual-audit.spec.js` visita **sete páginas** do projeto e registra uma captura **fullPage** para cada uma nas resoluções 320×720, 375×812, 768×1024, 1024×768 e 1600×900 (35 capturas no total).

## Executar em Windows, Linux ou macOS

```bash
npm install
npx playwright install chromium
npm run test:visual
```

A configuração inicia o Vite em modo de demonstração automaticamente. **Não precisa iniciar JSON Server, banco ou outra janela de terminal.**

## Auditar o GitHub Pages publicado

```bash
# Bash
QA_BASE_URL=https://helioconde.github.io/Desafio-React-Francisco-Helio/ npm run test:visual
```

No PowerShell:

```powershell
$env:QA_BASE_URL="https://helioconde.github.io/Desafio-React-Francisco-Helio/"
npm run test:visual
Remove-Item Env:QA_BASE_URL
```

O script não abre um servidor local quando `QA_BASE_URL` está definido. O endereço **deve terminar em barra /** para preservar o subcaminho do projeto hospedado.

## Evidências geradas

- `test-results/visual-audit/screenshots/{dispositivo-resolução}/{pagina}.png` — imagens completas;
- `test-results/visual-audit/index.html` — galeria para comparar as páginas lado a lado;
- `test-results/visual-audit/summary.json` — resumo das verificações;
- `test-results/visual-audit/{dispositivo}.json` — problemas detalhados por página;
- `playwright-report/index.html` — relatório de testes;
- `test-results/playwright/` — rastreamentos e capturas em caso de falha.

Em GitHub Actions, baixar o artefato **auditoria-visual-playwright**. Abrir o arquivo `test-results/visual-audit/index.html` da pasta extraída, **mantendo** os diretórios de screenshots próximos ao HTML.

## O que gera falha de teste

1. Exceções JavaScript não tratadas, usando `pageerror`;
2. Erros no console do navegador;
3. Requisições que falharam dentro do mesmo domínio do site;
4. Ausência do título esperado ou falha de carregamento;
5. Scroll horizontal na página principal;
6. Estruturas centrais saindo da largura visível;
7. Sobreposição entre header e área principal;
8. Erro ao salvar captura.

Tabelas podem ter **scroll horizontal interno intencional**, mas a própria página não deve apresentar transbordamento.

**Limites:** A auditoria é automática, mas não substitui inspeção humana da identidade visual; páginas de dados usam **somente registros fictícios** em contextos isolados. Ela não faz comparação pixel a pixel com o Figma nem verifica visualmente cada texto cortado. Quando existirem problemas, o relatório inclui as capturas para investigação.
