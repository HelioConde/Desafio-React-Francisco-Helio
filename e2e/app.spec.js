import { test, expect } from '@playwright/test';

test('dashboard e navegação carregam registros da API', async ({ page }) => {
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
  await expect(page.getByText('Funcionário Exemplo 01').first()).toBeVisible();
  await page.getByRole('link', { name: 'Funcionários', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Funcionários', exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});

test('valida, cadastra, edita, persiste e exclui funcionário', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('./#/funcionarios/novo');
  await page.getByRole('button', { name: 'Cadastrar funcionário' }).click();
  await expect(page.getByRole('alert')).toContainText('Revise os campos');
  await expect(page.getByText('Informe o nome com pelo menos 3 caracteres.')).toBeVisible();
  await page.getByRole('textbox', { name: /Nome completo/ }).fill('Funcionário QA E2E');
  await page.locator('input[name="cargo"]').fill('Teste automatizado');
  await page.getByRole('button', { name: 'Cadastrar funcionário' }).click();
  await expect(page.getByRole('heading', { name: 'Funcionário QA E2E' })).toBeVisible();
  await page.getByRole('link', { name: 'Editar cadastro' }).click();
  await page.getByRole('textbox', { name: /Nome completo/ }).fill('Funcionário QA Atualizado');
  await page.getByRole('checkbox', { name: 'Funcionário ativo' }).uncheck();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByRole('heading', { name: 'Funcionário QA Atualizado' })).toBeVisible();
  await expect(page.getByText('Inativo', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Funcionário QA Atualizado' })).toBeVisible();
  await page.goto('./#/funcionarios');
  await page.getByRole('searchbox', { name: /Buscar por nome/ }).fill('Funcionário QA Atualizado');
  await page.getByRole('combobox', { name: 'Status' }).selectOption('inativos');
  await expect(page.getByRole('row', { name: /Funcionário QA Atualizado/ })).toBeVisible();
  await page.getByRole('button', { name: 'Excluir Funcionário QA Atualizado' }).click();
  await expect(page.getByRole('status')).toContainText('excluído');
  await expect(page.getByText('Nenhum funcionário encontrado.')).toBeVisible();
});

test('anexo PDF fica acessível e arquivo inválido é rejeitado', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('./#/funcionarios/novo');
  await page.getByRole('textbox', { name: /Nome completo/ }).fill('Funcionário QA Anexo');
  await page.locator('input[name="cargo"]').fill('Teste automatizado');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'evidencia.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nDocumento sintético'),
  });
  await page.getByRole('button', { name: 'Cadastrar funcionário' }).click();
  await expect(page.getByText('evidencia.pdf')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Baixar anexo' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('evidencia.pdf');
  await page.getByRole('link', { name: 'Voltar' }).click();
  await page.getByRole('searchbox', { name: /Buscar por nome/ }).fill('Funcionário QA Anexo');
  await page.getByRole('button', { name: 'Excluir Funcionário QA Anexo' }).click();
  await expect(page.getByText('Nenhum funcionário encontrado.')).toBeVisible();
  await page.goto('./#/funcionarios/novo');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'script.html', mimeType: 'text/html', buffer: Buffer.from('<script>bad</script>'),
  });
  await page.getByRole('textbox', { name: /Nome completo/ }).fill('Funcionário Teste Arquivo');
  await page.locator('input[name="cargo"]').fill('Teste automatizado');
  await page.getByRole('button', { name: 'Cadastrar funcionário' }).click();
  await expect(page.getByRole('alert')).toContainText('Revise os campos');
});

for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1600, height: 900 }]) {
  test('layout sem estouro horizontal: ' + viewport.width + '×' + viewport.height, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('./#/funcionarios');
    await expect(page.getByRole('heading', { name: 'Funcionários', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    if (viewport.width < 821) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
      await page.getByRole('button', { name: 'Fechar menu' }).first().click();
    }
  });
}

test('capturas demonstrativas para revisão visual', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
  await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./#/funcionarios');
  await expect(page.locator('.mobile-employee-list')).toBeVisible();
  await page.screenshot({ path: 'test-results/funcionarios-mobile.png', fullPage: true });
});


test('dados locais corrompidos mostram recuperação explícita, sem exclusão silenciosa', async ({ page }) => {
  await page.goto('./#/funcionarios');
  await expect(page.getByRole('heading', { name: 'Funcionários', exact: true })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('sea-demo-employees-v2', '{"quebrado":true}'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('dados locais da demonstração estão inválidos');
  await expect(page.getByText('Funcionário Exemplo 01')).toHaveCount(0);
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Restaurar exemplos' }).click();
  await expect(page.getByRole('alert')).toContainText('inválidos');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Restaurar exemplos' }).click();
  await expect(page.getByText('Funcionário Exemplo 01').first()).toBeVisible();
  await expect(page.getByRole('status')).toContainText('restaurados');
});
