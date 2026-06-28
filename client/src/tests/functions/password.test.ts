const { isPasswordValid } = require('../../utils/password')
const { getPasswordValidationMessage } = require('../../utils/password')

describe("Funções de validação de senha", () => {
  test('Valida se o ! é interpretado como caractere especial', ()=>{
    const validacaoSenhaValida = isPasswordValid('Senha1234!');
    expect(validacaoSenhaValida).toBe(false)
  })

  test('Valida se uma senha é valida', ()=>{
    const validacaoSenhaValida = isPasswordValid('Senha1234*');
    expect(validacaoSenhaValida).toBe(true)
  })

  test('Valida se uma senha é invalida estando vazia', ()=>{
    const validacaoSenhaVazia = isPasswordValid('');
    expect(validacaoSenhaVazia).toBe(false)
    const mensagemSenhaVazia = getPasswordValidationMessage('');
    expect(mensagemSenhaVazia).toEqual('Senha é obrigatória')
  })

  test('Valida se uma senha é invalida sem letra minuscula e sem numeros', ()=>{
    const validacaoSenhaSemMinuscula = isPasswordValid('SENHAFORTE*');
    expect(validacaoSenhaSemMinuscula).toBe(false)
    const mensagemSenhaSemMinuscula = getPasswordValidationMessage('SENHAFORTE*');
    expect(mensagemSenhaSemMinuscula).toEqual('A senha deve conter: uma letra minúscula, um número')
  })

  test('Valida se uma senha é invalida com menos de 8 caracteres e sem caractere especial', ()=>{
    const validacaoSenhaCurta = isPasswordValid('Se124');
    expect(validacaoSenhaCurta).toBe(false)
    const mensagemSenhaCurta = getPasswordValidationMessage('Se124');
    expect(mensagemSenhaCurta).toEqual('A senha deve conter: mínimo de 8 caracteres, um caractere especial')
  })
})