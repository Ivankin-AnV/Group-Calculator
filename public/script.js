import { setupView } from '../src/views/calculatorView.js';
import { setupController } from '../src/controllers/calculatorController.js';

document.addEventListener("DOMContentLoaded", () => {
  setupView();
  setupController();
});

function sendOperationToServer(expression, result) {
  fetch('http://localhost:5500/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expression, result }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка при сохранении операции');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function loadHistory() {
fetch('http://localhost:5500/api/history')
  .then((response) => response.json())
  .then((data) => {
    console.log('История операций:', data);
      historyContainer.innerHTML = '';
      data.forEach((entry) => {
        const div = document.createElement('div');
        div.textContent = `${entry.expression} = ${entry.result}`;
        historyContainer.appendChild(div);
      });
    })
    .catch((error) => {
      console.error('Ошибка при загрузке истории:', error);
    });
}

// Вызовите эту функцию при загрузке страницы
window.addEventListener('DOMContentLoaded', loadHistory);

// форма регистрации 
 document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("register-modal");
  const toggleBtn = document.getElementById("toggle-register");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("register-form");

  toggleBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    
    // Просто показываем введенные данные (или можно добавить валидацию/сохранение)
    alert(`Спасибо за регистрацию, ${email}!`);
    
    // Закрываем форму после отправки
    modal.classList.add("hidden");
    form.reset();

      // Отправка данных на сервер через fetch
      fetch('http://localhost:5500/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      })
      .then(response => {
        if (response.ok) {
          alert(`Спасибо за регистрацию, ${username || "пользователь"}!`);
          modal.classList.add("hidden");
          form.reset();
        } else {
          alert("Ошибка при регистрации.");
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
        alert("Ошибка при подключении к серверу.");
      });
    });
  });

  