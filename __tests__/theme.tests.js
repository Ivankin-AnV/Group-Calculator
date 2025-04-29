describe("Theme Toggle Function", () => {
  let body;
  let themeToggle;

  beforeEach(() => {
    // Создаем кнопку переключения темы
    document.body.innerHTML = `<button id="themeToggle"></button>`;
    
    // Инициализируем элементы
    body = document.body;
    themeToggle = document.getElementById("themeToggle");

    // Очищаем предыдущие состояния
    body.classList.remove("light-theme");
    localStorage.clear();

    // Добавляем обработчик события как в оригинальном коде
    themeToggle.addEventListener("click", () => {
      if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark-theme");
      } else {
        body.classList.add("light-theme");
        localStorage.setItem("theme", "light-theme");
      }
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("should switch from light to dark theme on click", () => {
    // Начальное состояние: light theme
    body.classList.add("light-theme");
    
    themeToggle.click();
    
    expect(body.classList.contains("light-theme")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("dark-theme");
  });

  test("should switch from dark to light theme on click", () => {
    // Начальное состояние: dark theme (по умолчанию)
    expect(body.classList.contains("light-theme")).toBe(false);
    
    themeToggle.click();
    
    expect(body.classList.contains("light-theme")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light-theme");
  });

  test("should persist theme preference in localStorage", () => {
    // Первый клик: dark → light
    themeToggle.click();
    expect(localStorage.getItem("theme")).toBe("light-theme");

    // Второй клик: light → dark
    themeToggle.click();
    expect(localStorage.getItem("theme")).toBe("dark-theme");
  });

  test("should toggle theme correctly on multiple clicks", () => {
    // Клик 1: dark → light
    themeToggle.click();
    expect(body.classList.contains("light-theme")).toBe(true);

    // Клик 2: light → dark
    themeToggle.click();
    expect(body.classList.contains("light-theme")).toBe(false);

    // Клик 3: dark → light
    themeToggle.click();
    expect(body.classList.contains("light-theme")).toBe(true);
  });
});