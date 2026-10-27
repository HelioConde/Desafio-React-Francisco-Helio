import { test, expect } from '@playwright/test';

test('GitHub Pages: assets, SPA e persistência de demonstração', async ({ page }) => {
  const exceptions = [];
  page.on('pageerror', (error) => exceptions.push(String(error.message || error)));
  const consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await page.goto('./#/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Visão geral', exact: true })).toBeVisible();
  await expect(page.getByText('Funcionário Exemplo 01').first()).toBeVisible();
  await page.goto('./#/funcionarios');
  await expect(page.getByRole('heading', { name: 'Funcionários', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Adicionar funcionário' }).first().click();
  await expect(page.getByRole('heading', { name: 'Adicionar funcionário', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: /Nome completo/ }).fill('Funcionário QA Pages');
  await page.locator('input[name="cargo"]').fill('Teste automático');
  await page.getByRole('button', { name: 'Cadastrar funcionário' }).click();
  await expect(page.getByRole('heading', { name: 'Funcionário QA Pages' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Funcionário QA Pages' })).toBeVisible();
  expect(exceptions, 'Exceções JavaScript').toEqual([]);
  expect(consoleErrors, 'Erros no console').toEqual([]);
});

test('ícone próprio carregado no navegador e na marca do menu', async ({ page, request }) => {
  await page.goto('./#/');
  const icon = page.locator('link[rel="icon"][type="image/svg+xml"]');
  await expect(icon).toHaveCount(1);
  const href = await icon.getAttribute('href');
  expect(href).toContain('favicon.svg');
  const response = await request.get(new URL(href, page.url()).toString());
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('Capacete de proteção');
  await expect(page.locator('.brand-icon img')).toBeVisible();
});
