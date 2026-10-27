import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('test-results/visual-audit');
const cases = [
  { name: 'inicio', hash: '#/', title: 'Visão geral' },
  { name: 'funcionarios', hash: '#/funcionarios', title: 'Funcionários' },
  { name: 'novo-funcionario', hash: '#/funcionarios/novo', title: 'Adicionar funcionário' },
  { name: 'detalhes', hash: '#/funcionarios/1', title: 'Funcionário Exemplo 01' },
  { name: 'editar', hash: '#/funcionarios/1/editar', title: 'Editar funcionário' },
  { name: 'historico', hash: '#/historico', title: 'Histórico' },
  { name: 'sobre', hash: '#/perfil', title: 'Sobre o projeto' },
];
const viewports = [
  { name: 'mobile-pequeno', width: 320, height: 720 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'notebook', width: 1024, height: 768 },
  { name: 'desktop-compacto', width: 1366, height: 648 },
  { name: 'desktop', width: 1600, height: 900 },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

// Detecta scroll horizontal GLOBAL, elementos estruturais fora da tela
// e intersecção inesperada entre o cabeçalho e o conteúdo.
async function inspectLayout(page) {
  return page.evaluate(() => {
    const issues = [];
    const viewport = document.documentElement.clientWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth, document.body?.scrollWidth || 0,
    );
    if (documentWidth > viewport + 2) {
      issues.push({ kind: 'horizontal-overflow', viewport, documentWidth });
    }
    for (const element of document.querySelectorAll(
      '.topbar, .page-content, .page-heading, .panel, .stat-card, .sidebar, .form-actions',
    )) {
      const style = window.getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none' ||
          Number(style.opacity) === 0) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.left < -2 || rect.right > viewport + 2) {
        issues.push({
          kind: 'structural-overflow',
          selector: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          viewport,
        });
      }
    }
    const header = document.querySelector('.topbar')?.getBoundingClientRect();
    const content = document.querySelector('.page-content')?.getBoundingClientRect();
    if (header && content && header.bottom > content.top + 3) {
      issues.push({ kind: 'header-overlap', headerBottom: header.bottom, contentTop: content.top });
    }
    return issues;
  });
}

async function saveGallery() {
  fs.mkdirSync(outputDir, { recursive: true });
  const reports = fs.readdirSync(outputDir)
    .filter((file) => viewports.some((viewport) => file === viewport.name + '.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(outputDir, file), 'utf8')));
  const total = reports.reduce((n, report) => n + report.pages.length, 0);
  const errors = reports.reduce((n, report) => n + report.pages.reduce((a, p) => a + p.issues.length, 0), 0);
  const sections = reports.map((report) => `
    <section><h2>${escapeHtml(report.viewport.name)} — ${report.viewport.width}×${report.viewport.height}</h2>
    <div class="grid">${report.pages.map((p) => `
      <article><h3>${escapeHtml(p.name)} <span class="${p.issues.length ? 'error' : 'ok'}">${p.issues.length ? p.issues.length + ' problemas' : 'OK'}</span></h3>
      <a href="${escapeHtml(p.file)}"><img loading="lazy" src="${escapeHtml(p.file)}" alt="Captura completa de ${escapeHtml(p.name)}"></a>
      <details><summary>Erros e medições</summary><pre>${escapeHtml(JSON.stringify({ url: p.url, issues: p.issues }, null, 2))}</pre></details></article>
    `).join('')}</div></section>
  `).join('');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Auditoria visual • Gestão EPI</title><style>
*{box-sizing:border-box}body{font:15px system-ui;margin:0;background:#f4f7fa;color:#18364c}header{padding:30px 5%;background:#176a91;color:white}
main{padding:24px 5%}h1{margin:0}h2{margin:25px 0 15px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px}
article{background:white;border:1px solid #dce5ed;border-radius:12px;padding:14px;min-width:0}h3{font-size:15px;display:flex;justify-content:space-between;gap:8px}
img{display:block;width:100%;height:260px;object-fit:contain;object-position:top;background:#f1f5f9;border:1px solid #dce5ed}
pre{white-space:pre-wrap;word-break:break-word;font-size:12px}.error{color:#b42338}.ok{color:#147548}details{margin-top:10px}
</style></head><body><header><h1>Auditoria visual automatizada</h1><p>${total} capturas • ${errors} ocorrência(s) • ${escapeHtml(new Date().toISOString())}</p></header>
<main>${sections}</main></body></html>`;
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
  fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify({
    generatedAt: new Date().toISOString(), screenshots: total, issues: errors,
    viewports: reports.map((r) => r.viewport),
  }, null, 2));
}

test.describe('Capturas automáticas + console + responsividade', () => {
  test.beforeAll(() => { fs.rmSync(outputDir, { recursive: true, force: true }); });
  test.afterAll(async () => { await saveGallery(); });

  for (const viewport of viewports) {
    test(`auditar ${viewport.name} ${viewport.width}×${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const results = [];

      for (const site of cases) {
        const issues = [];
        const onConsole = (message) => {
          if (message.type() === 'error') issues.push({
            kind: 'console-error', message: message.text().slice(0, 700),
          });
        };
        const onPageError = (error) => issues.push({
          kind: 'javascript-exception', message: String(error?.stack || error).slice(0, 1300),
        });
        const onRequestFailed = (request) => {
          if (new URL(request.url()).origin === new URL(testInfo.project.use.baseURL).origin) {
            issues.push({ kind: 'request-failed', url: request.url(), error: request.failure()?.errorText });
          }
        };
        page.on('console', onConsole);
        page.on('pageerror', onPageError);
        page.on('requestfailed', onRequestFailed);

        const filename = `screenshots/${viewport.name}-${viewport.width}x${viewport.height}/${site.name}.png`;
        const fullPath = path.join(outputDir, filename);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });

        try {
          await page.goto('./' + site.hash, { waitUntil: 'domcontentloaded', timeout: 20_000 });
          await expect(page.getByRole('heading', { name: site.title, exact: true }).first()).toBeVisible({ timeout: 12_000 });
          await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 8_000 });
          issues.push(...await inspectLayout(page));
          if (site.name === 'funcionarios' && viewport.width <= 600) {
            await expect(page.locator('.mobile-employee-list')).toBeVisible();
            await expect(page.locator('.mobile-person-actions').first()).toBeVisible();
          }
        } catch (error) {
          issues.push({ kind: 'navigation-or-layout', message: String(error.message || error).slice(0, 1200) });
        }
        try {
          await page.screenshot({ path: fullPath, fullPage: true, animations: 'disabled', timeout: 20_000 });
          await testInfo.attach(`${viewport.name}-${site.name}`, { path: fullPath, contentType: 'image/png' });
        } catch (error) {
          issues.push({ kind: 'screenshot', message: String(error.message || error).slice(0, 600) });
        }

        page.off('console', onConsole);
        page.off('pageerror', onPageError);
        page.off('requestfailed', onRequestFailed);

        results.push({ name: site.name, url: page.url(), file: filename, issues });
      }
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, viewport.name + '.json'), JSON.stringify({ viewport, pages: results }, null, 2));
      const problems = results.flatMap((result) => result.issues.map((issue) => ({ page: result.name, ...issue })));
      expect(problems, `Falhas na resolução ${viewport.width}×${viewport.height}; consulte test-results/visual-audit/index.html`).toEqual([]);
    });
  }
});
