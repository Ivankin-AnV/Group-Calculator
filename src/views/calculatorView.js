export function setupView() {
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.body;
  
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) body.classList.add(savedTheme);
  
    themeToggle.addEventListener("click", () => {
      if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark-theme");
      } else {
        body.classList.add("light-theme");
        localStorage.setItem("theme", "light-theme");
      }
    });
  }
  