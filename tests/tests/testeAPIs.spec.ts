import { test, expect } from '@playwright/test';

const urlApi = 'http://localhost:8080';
let emailTeste = '';
let senhaValida = 'SenhaValida123*';

test.describe.serial('Exercício - Tests de API', () => {

  test.beforeAll(() => {
    emailTeste = "email_"
    .concat(Math.random().toString(36).substring(2, 12))
    .concat("@exemplo.com");
  });

  test('Teste 1: Signup com sucesso - retorna dados do usuário', async ({ request }) => {
    const response = await request.post(`${urlApi}/auth/signup`, {
      data: {
        email: emailTeste,
        password: senhaValida,
      },
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('email', emailTeste);
    expect(responseBody).toHaveProperty('password');
  });

  test('Teste 2: Signup com e-mail duplicado - retorna erro 409', async ({ request }) => {
    const response = await request.post(`${urlApi}/auth/signup`, {
      data: {
        email: emailTeste, 
        password: senhaValida,
      },
    });

    expect(response.status()).toBe(409);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toContain('E-mail já está em uso');
    expect(responseBody).toHaveProperty('status', 409);
  });

  test('Teste 3: Signin com credenciais válidas - retorna dados do usuário', async ({ request }) => {
    const response = await request.post(`${urlApi}/auth/signin`, {
      data: {
        email: emailTeste,
        password: senhaValida,
      },
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('email', emailTeste);
    expect(responseBody).toHaveProperty('password');
  });

  test('Teste 4: Signin com senha incorreta - retorna erro 401', async ({ request }) => {
    const response = await request.post(`${urlApi}/auth/signin`, {
      data: {
        email: emailTeste,
        password: 'SenhaErrada123!', // Senha diferente
      },
    });

    expect(response.status()).toBe(401);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toContain('Credenciais inválidas');
    expect(responseBody).toHaveProperty('status', 401);
  });

});
