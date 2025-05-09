import { fractionToDecimal, calculateExpression } from '../src/models/calculatorModel.js';

describe('fractionToDecimal', () => {
  test('корректно обрабатывает простую дробь', () => {
    expect(fractionToDecimal('3/4')).toBe(0.75);
  });

  test('заменяет запятые на точки в числителе и знаменателе', () => {
    expect(fractionToDecimal('5,2/3')).toBeCloseTo(1.73333333);
    expect(fractionToDecimal('2/4,5')).toBeCloseTo(0.44444444);
  });

  test('обрабатывает отрицательные дроби', () => {
    expect(fractionToDecimal('-1/2')).toBe(-0.5);
    expect(fractionToDecimal('3/-4')).toBe(-0.75);
    expect(fractionToDecimal('-5/-10')).toBe(0.5);
  });

  test('бросает ошибку при делении на ноль', () => {
    expect(() => fractionToDecimal('5/0')).toThrow('Деление на ноль');
    expect(() => fractionToDecimal('0/0')).toThrow('Деление на ноль');
  });

  test('возвращает 0 при нулевом числителе', () => {
    expect(fractionToDecimal('0/5')).toBe(0);
  });
});

describe('calculateExpression', () => {
  test('вычисляет простое выражение с одной дробью', () => {
    expect(calculateExpression('1/2')).toBe(0.5);
  });

  test('вычисляет выражение с несколькими дробями', () => {
    expect(calculateExpression('1/2 + 1/4')).toBeCloseTo(0.75, 10);
    expect(calculateExpression('3/2 * 4/5')).toBeCloseTo(1.2, 10);
    expect(calculateExpression('(1/2 + 3/4) / 2')).toBeCloseTo(0.625, 10);
  });

  test('корректно заменяет запятые на точки во всём выражении', () => {
    expect(calculateExpression('2,5/5')).toBe(0.5);
    expect(calculateExpression('3/4,5')).toBeCloseTo(0.66666667);
    expect(calculateExpression('2,5 + 3,5')).toBe(6);
  });

  test('обрабатывает отрицательные выражения', () => {
    expect(calculateExpression('-1/2 * 2')).toBe(-1);
    expect(calculateExpression('(1/2 - 3/4) * 2')).toBe(-0.5);
  });

  test('бросает ошибку при делении на ноль в выражении', () => {
    expect(() => calculateExpression('5/0 + 1')).toThrow('Деление на ноль');
    expect(() => calculateExpression('1/(2/0)')).toThrow('Деление на ноль');
  });

  test('корректно обрабатывает цепочки операций', () => {
    expect(calculateExpression('((1/2)/3)/4')).toBeCloseTo(0.04166667, 7);
    expect(calculateExpression('10/2/5')).toBe(1);
  });

  test('бросает ошибку при невалидном выражении', () => {
    expect(() => calculateExpression('1/2 + abc')).toThrow();
    expect(() => calculateExpression('invalid')).toThrow();
  });
});