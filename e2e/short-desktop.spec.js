import { test, expect } from '@playwright/test';

test('painel e lista com três exemplos cabem na janela desktop de 1366×648', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 648 });
  await page.goto('./#/');
  await expect(page.getByText('Funcionário Exemplo 03').first()).toBeVisible();
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollHeight <= document.documentElement.clientHeight + 4
  )).toBe(true);
  await page.goto('./#/funcionarios');
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Funcionário Exemplo 03').first()).toBeVisible();
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollHeight <= document.documentElement.clientHeight + 4
  )).toBe(true);
});
