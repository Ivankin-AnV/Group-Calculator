import { setupView } from '../src/views/calculatorView.js';
describe('setupView', () => {
  let themeToggle;
  let body;

  beforeEach(() => {
    document.body.innerHTML = '<button id="theme-toggle"></button>';
    body = document.body;
    themeToggle = document.querySelector('#theme-toggle');
    localStorage.clear();
  });

  afterEach(() => {
    body.className = '';
  });

  describe('Initial setup', () => {
    it('должна применять сохраненную светлую тему из localStorage', () => {
      localStorage.setItem('theme', 'light-theme');
      setupView();
      expect(body.classList.contains('light-theme')).toBe(true);
    });

    it('должна применять сохраненную темную тему из localStorage', () => {
      localStorage.setItem('theme', 'dark-theme');
      setupView();
      expect(body.classList.contains('dark-theme')).toBe(true);
    });

    it('не должна добавлять классы если нет сохраненной темы', () => {
      setupView();
      expect(body.classList.length).toBe(0);
    });
  });

  describe('Theme toggle', () => {
    it('должна переключаться с светлой на темную тему', () => {
      body.classList.add('light-theme');
      setupView();
      
      themeToggle.click();
      expect(body.classList.contains('light-theme')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('dark-theme');
    });

    it('должна переключаться с темной на светлую тему', () => {
      setupView();
      
      themeToggle.click();
      expect(body.classList.contains('light-theme')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('light-theme');
    });

    it('должна сохранять новую тему в localStorage при клике', () => {
      setupView();
      
      themeToggle.click();
      expect(localStorage.getItem('theme')).toBe('light-theme');
      
      themeToggle.click();
      expect(localStorage.getItem('theme')).toBe('dark-theme');
    });
  });
});