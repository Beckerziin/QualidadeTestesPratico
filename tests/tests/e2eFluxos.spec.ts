import { test, expect } from '@playwright/test';

const clientUrl = 'http://localhost:3000'; 
const apiUrl = 'http://localhost:8080';
const emailTeste = "email_"
.concat(Math.random().toString(36).substring(2, 12))
.concat("@exemplo.com");
const senhaValida = 'SenhaValida123*';

test.describe('Testes E2E - Fluxos de Usuário', () => {

  test('Teste 1: Usuário acessa o sistema e realiza cadastro', async ({ page, request }) => {
    
    await page.goto(clientUrl);
    
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await page.getByRole('textbox', { name: 'seu@email.com' }).fill(emailTeste);

    await page.getByRole('textbox', { name: '••••••••' }).first().fill(senhaValida);
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill(senhaValida);

    await page.getByRole('main').getByRole('button', { name: 'Criar Conta' }).click();

    await page.waitForTimeout(3000);

    const confirmacaoDb = await request.post(`${apiUrl}/auth/signin`, {
      data: { email: emailTeste, password: senhaValida }
    });
    
    expect(confirmacaoDb.status()).toBe(200);
  });

  test('Teste 2: Usuário realiza login e acessa o sistema', async ({ page }) => {

    await page.request.post(`${apiUrl}/auth/signup`, {
      data: { email: emailTeste, password: senhaValida }
    });

    await page.goto(clientUrl);
    
    await page.getByRole('button', { name: /entrar/i }).first().click();

    const inputs = page.locator('input');
    await inputs.nth(0).fill(emailTeste);
    await inputs.nth(1).fill(senhaValida);
    
    await inputs.nth(1).press('Enter');
    
    await expect(page.getByRole('button', { name: /sair/i })).toBeVisible({ timeout: 5000 });
  });

});