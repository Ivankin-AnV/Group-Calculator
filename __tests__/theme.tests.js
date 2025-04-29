
describe("Theme Toggle Functionality", () => {
    let body;
    let themeToggle;
    let originalLocalStorage;
  
    beforeAll(() => {
      // Mock body
      body = {
        classList: {
          contains: jest.fn(),
          remove: jest.fn(),
          add: jest.fn()
        }
      };
  
      // Mock themeToggle
      themeToggle = {
        addEventListener: jest.fn()
      };
  
      // Mock localStorage
      originalLocalStorage = global.localStorage;
      global.localStorage = {
        setItem: jest.fn(),
        getItem: jest.fn()
      };
  
      // Выполняем тестируемый код
      require("./public/script.js");
    });
  
    afterAll(() => {
      global.localStorage = originalLocalStorage;
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test("should switch from light to dark theme", () => {
      body.classList.contains.mockReturnValue(true);
      const clickHandler = themeToggle.addEventListener.mock.calls[0][1];
  
      clickHandler();
  
      expect(body.classList.remove).toHaveBeenCalledWith("light-theme");
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark-theme");
      expect(body.classList.add).not.toHaveBeenCalled();
    });
  
    test("should switch from dark to light theme", () => {
      body.classList.contains.mockReturnValue(false);
      const clickHandler = themeToggle.addEventListener.mock.calls[0][1];
  
      clickHandler();
  
      expect(body.classList.add).toHaveBeenCalledWith("light-theme");
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light-theme");
      expect(body.classList.remove).not.toHaveBeenCalled();
    });
  
    test("should handle multiple consecutive clicks", () => {

      const clickHandler = themeToggle.addEventListener.mock.calls[0][1];
      
      // Первый клик (светлая -> тёмная)
      body.classList.contains.mockReturnValue(true);
      clickHandler();
  
      // Второй клик (тёмная -> светлая)
      body.classList.contains.mockReturnValue(false);
      clickHandler();
  
      expect(body.classList.remove).toHaveBeenCalledTimes(1);
      expect(body.classList.add).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenNthCalledWith(1, "theme", "dark-theme");
      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, "theme", "light-theme");
    });
  
    test("should validate event listener registration", () => {
      expect(themeToggle.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });
  });