// Testes unitários
// Testes ponta a ponta (e2e)

/*
    => Padrão AAA

     > Configuração do teste (Arrange)
     > Algo que deseja fazer a ação (Act)
     > Conferir se a ação foi esperada (Assert)
*/

describe('UsersService', () => {
  //   it('deveria testar o modulo usersservice', () => {});

  //   test('testar se o users service foi definido', () => {});

  it('should be define users service', () => {
    const numero1 = 150;
    const numero2 = 100;

    const conta = numero1 - numero2;

    // expect(conta).toBe(50);
    expect(conta).toBeGreaterThan(10);
  });
});
