const { isEmailValid } = require('../../utils/email')
const { getEmailValidationMessage } = require('../../utils/email')

describe("Funções de validação de e-mail", () => {
  test('Valida se um e-mail é valido', ()=>{
    const validacaoEmailValido = isEmailValid('email@email.com');
    expect(validacaoEmailValido).toBe(true)
  })

  test('Valida se um e-mail não é valido', ()=>{
    const validacaoEmailInvalido = isEmailValid('nao-e-um-email');
    expect(validacaoEmailInvalido).toBe(false)
    const mensagemEmailInvalido = getEmailValidationMessage('nao-e-um-email');
    expect(mensagemEmailInvalido).toEqual('Email inválido')
  })

  test('Valida se um e-mail não é valido com email vazio', ()=>{
    const validacaoEmailVazio = isEmailValid('');
    expect(validacaoEmailVazio).toBe(false)
    const mensagemEmailVazio = getEmailValidationMessage('');
    expect(mensagemEmailVazio).toEqual('Email é obrigatório')
  })
})