import { setupController } from '../src/controllers/calculatorController.js';
import { calculateExpression } from '../src/models/calculatorModel.js';

jest.mock('../src/models/calculatorModel.js');

describe('Calculator Controller', () => {
  let display, buttons;

  beforeEach(() => {
    // Мокаем window.location
    delete window.location;
    window.location = { href: '' };

    // Создаем минимальный DOM
    document.body.innerHTML = `
      <div class="display">0</div>
      <div id="history-content"></div>
      <button class="btn btn-number">1</button>
      <button class="btn btn-number">0</button>
      <button class="btn btn-number">2</button>
      <button class="btn btn-number">4</button>
      <button class="btn btn-clear">C</button>
      <button class="btn btn-backspace">←</button>
      <button class="btn btn-operator">+</button>
      <button class="btn btn-operator">-</button>
      <button class="btn btn-equals">=</button>
      <button class="btn btn-decimal">,</button>
      <button class="btn btn-percent">%</button>
      <button id="clearHistory"></button>
    `;

    setupController();
    display = document.querySelector('.display');
    buttons = document.querySelectorAll('.btn');
  });

  test('Initial display shows 0', () => {
    expect(display.textContent).toBe('0');
  });

  test('Number input replaces initial zero', () => {
    document.querySelector('.btn-number').click();
    expect(display.textContent).toBe('1');
  });

  test('Clear button resets display', () => {
    document.querySelector('.btn-number').click();
    document.querySelector('.btn-clear').click();
    expect(display.textContent).toBe('0');
  });

  test('Backspace removes last character', () => {
    document.querySelector('.btn-number').click();
    document.querySelector('.btn-backspace').click();
    expect(display.textContent).toBe('0');
  });

  test('Decimal input adds comma once', () => {
    document.querySelector('.btn-decimal').click();
    document.querySelector('.btn-decimal').click();
    expect(display.textContent).toBe('0,');
  });

  test('Percentage converts value correctly', () => {
    // Нажимаем 1 -> 0 -> 0
    buttons[0].click(); // 1
    buttons[1].click(); // 0
    buttons[1].click(); // 0
    document.querySelector('.btn-percent').click();
    expect(display.textContent).toBe('1');
  });

  test('Calculation updates history', () => {
  calculateExpression.mockReturnValue(3);
  
  // Нажимаем 1
  const oneButton = Array.from(buttons).find(b => b.textContent === '1');
  oneButton.click();
  
  // Находим кнопку "+"
  const plusButton = Array.from(buttons).find(b => 
    b.classList.contains('btn-operator') && b.textContent === '+'
  );
  plusButton.click();
  
  // Нажимаем 2
  const twoButton = Array.from(buttons).find(b => b.textContent === '2');
  twoButton.click();
  
  // Нажимаем =
  const equalsButton = Array.from(buttons).find(b => b.textContent === '=');
  equalsButton.click();
  
  const history = document.getElementById('history-content');
  expect(history.innerHTML).toContain('1+2 = 3');
  expect(display.textContent).toBe('3');
});

  test('Error handling shows message', () => {
    calculateExpression.mockImplementation(() => {
      throw new Error('Invalid input');
    });
    
    document.querySelector('.btn-number').click();
    document.querySelector('.btn-equals').click();
    
    expect(display.textContent).toBe('Ошибка');
    expect(display.classList.contains('error')).toBe(true);
  });

  test('Secret code redirects to dino', () => {
    const code = ['2', '-', '0', '-', '0', '-', '4'];
    code.forEach(char => {
      const btn = Array.from(buttons).find(b => b.textContent === char);
      btn.click();
    });
    
    expect(window.location.href).toBe('/public/dino/dino.html');
  });
});