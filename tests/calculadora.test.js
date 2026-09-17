const { soma, subtrai } = require('../src/calculadora');

describe('Testes de Operações Matemáticas', () => {
  test('Deve somar 2 + 3 e retornar 5', () => {
    expect(soma(2, 3)).toBe(5);
  });

  test('Deve subtrair 5 - 2 e retornar 3', () => {
    expect(subtrai(5, 2)).toBe(3);
  });
});

test('Deve multiplicar 2 * 4 e retornar 8', () => {
  expect(multiplica(2, 4)).toBe(8);
});