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
