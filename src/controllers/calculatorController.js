import { calculateExpression } from "../models/calculatorModel.js";

export function setupController() {
  const display = document.querySelector(".display");
  const buttons = document.querySelectorAll(".btn");
  const historyContent = document.getElementById("history-content");
  const clearHistoryBtn = document.getElementById("clearHistory");

  let currentInput = "0";

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (button.classList.contains("btn-clear")) {
        clear();
      } else if (button.classList.contains("btn-backspace")) {
        backspace();
      } else if (value === "=") {
        calculate();
      } else if (value === "✖") {
        append("*");
      } else if (value === "✘") {
        append("/");
      } else if (value === "+" || value === "-" || value === "%") {
        value === "%" ? percent() : append(value);
      } else if (value === ",") {
        appendDecimal();
      } else {
        append(value);
      }
    });
  });

  clearHistoryBtn.addEventListener("click", () => {
    historyContent.innerHTML = "";
  });

  function clear() {
    currentInput = "0";
    updateDisplay();
    display.classList.remove("error");
  }

  function backspace() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateDisplay();
  }

  function append(value) {
    currentInput = currentInput === "0" ? value : currentInput + value;
    updateDisplay();
    if (currentInput.includes("2-0-0-4")) {
      window.location.href = "/dino/dino.html";
    }
  }

  function appendDecimal() {
    if (!currentInput.includes(",")) {
      currentInput += ",";
      updateDisplay();
    }
  }

  function percent() {
    try {
      const value = parseFloat(currentInput.replace("%", "").replace(",", "."));
      currentInput = (value / 100).toString();
      updateDisplay();
    } catch {
      error();
    }
  }

  function calculate() {
    try {
      const result = calculateExpression(currentInput);
      historyContent.innerHTML += `<div>${currentInput} = ${result}</div>`;
      currentInput = result.toString();
      updateDisplay();
      display.classList.remove("error");
    } catch {
      error();
    }
  }

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function error() {
    display.textContent = "Ошибка";
    display.classList.add("error");
    currentInput = "0";
  }
}
