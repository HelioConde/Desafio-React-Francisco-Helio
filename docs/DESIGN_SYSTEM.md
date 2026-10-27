# Design System — Gestão EPI (Desafio React)

## Objetivo
Modernizar a experiência sem perder a referência original do desafio SEA Tecnologia: azul como cor primária, navegação lateral e cadastro por etapas. A referência Figma é indicada no README. A consulta automatizada do arquivo foi bloqueada por falta de acesso; portanto não há alegação de equivalência pixel a pixel.

## Tokens
| Categoria | Tokens | Aplicação |
| --- | --- | --- |
| Cores | `--primary`, `--primary-hover`, `--primary-soft` | Navegação, botões, foco |
| Semântica | `--success`, `--danger`, `--warning` e variantes `-bg` | Feedback e status |
| Superfícies | `--canvas`, `--surface`, `--border` | Layout e cartões |
| Texto | `--ink`, `--muted` | Hierarquia e legibilidade |
| Espaçamento | `--space-1` até `--space-8` | Base de 4 px |
| Bordas | `--radius-sm`, `--radius-md`, `--radius-lg` | Controles, cartões |
| Elevação | `--shadow` | Painéis e indicadores |
| Foco | `--focus` | Campos e acessibilidade |

## Componentes
- **Layout:** menu com `NavLink` ativo, barra de contexto, skip-link, rodapé de demonstração.
- **Botões:** `.btn-primary` para ações principais, `.btn-outline` para ações secundárias; desabilitar durante envio.
- **Cartões:** `.panel` para seções, `.stat-card` para KPIs.
- **Formulários:** rótulo sempre visível, `aria-invalid` e erro vinculado por `aria-describedby`.
- **Status:** `.status-active` e `.status-inactive`; nunca comunicar somente por cor.
- **Feedback:** `.notice-info`, `.notice-success`, `.notice-error`, com papel acessível quando necessário.
- **Tabelas:** com cabeçalhos semânticos, área de overflow **dentro da tabela**, nunca na viewport inteira.

## Breakpoints e comportamento
- Até 600 px: formulários empilhados e cards compactos.
- Até 820 px: menu retrátil, acionável por botão nomeado.
- Até 1100 px: KPIs e filtros em duas colunas.
- Verificação Playwright obrigatória em 375×812, 768×1024 e 1600×900.

## Acessibilidade e movimento
- Foco visível em todos os controles e link de pular ao conteúdo.
- Formulários com validação explícita e mensagens associadas.
- `prefers-reduced-motion: reduce` remove transições não essenciais.
- Elementos clicáveis têm semântica de botão ou link, sem `div onClick`.

## Fluxos críticos
1. Listagem com busca, status, cargo, ordenação e paginação.
2. Cadastro/edição com validação sem envio indevido.
3. Atividades com múltiplos EPIs/CA.
4. Excluir com confirmação.
5. Anexo local de PDF/PNG/JPG, máximo 2 MB.

## Segurança e restrições
Dados de demonstração somente. Sem login/permissões reais. JSON Server serve apenas como API local para testes; build Pages usa localStorage. Anexos no IndexedDB do navegador, sem envio para API e sem sincronização.

## Segurança da demonstração local — recuperação explícita
- JSON do navegador é validado antes de renderizar funcionários; estruturas inválidas ou mais de 500 registros geram um erro legível e não são apagadas silenciosamente.
- A restauração de exemplos fictícios fica disponível **somente no modo demonstração**, exige confirmação e preserva a escolha de cancelar.
- Falhas de quota e bloqueio de localStorage recebem feedback sem alegar persistência remota.
- Playwright valida armazenamento corrompido, cancelamento e restauração confirmada.
