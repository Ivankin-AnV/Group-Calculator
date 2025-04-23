let currentInput = "0";
const display = document.querySelector(".display");
const historyContent = document.getElementById("history-content");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("themeToggle");
const clearHistoryBtn = document.getElementById("clearHistory");
const body = document.body;

// Инициализация темы из localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    body.classList.add(savedTheme);
}

// Переключение темы
themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark-theme");
    } else {
        body.classList.add("light-theme");
        localStorage.setItem("theme", "light-theme");
    }
});

// Обработка нажатий на кнопки
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (button.classList.contains("btn-clear")) {
            clearDisplay();
        } else if (button.classList.contains("btn-backspace")) {
            deleteLastCharacter();
        } else if (value === "=") {
            calculate();
        } else if (value === "✖") {
            appendToDisplay("*");
        } else if (value === "✘") {
            appendToDisplay("/");
        } else if (value === "+") {
            appendToDisplay("+");
        } else if (value === "-") {
            appendToDisplay("-");
        } else if (value === "%") {
            calculatePercentage();
        } else if (value === ",") {
            appendDecimal();
        } else {
            appendToDisplay(value);
        }
    });
});

// Удаление последнего символа
const deleteLastCharacter = () => {
    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";
    display.textContent = currentInput;
};

// Очистка дисплея
const clearDisplay = () => {
    currentInput = "0";
    display.textContent = currentInput;
    display.classList.remove("error");
};

const fractionToDecimal = (fraction) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    if (denominator === 0) {
        throw new Error("Деление на ноль!");
    }
    return numerator / denominator;
};

const decimalToFraction = (decimal) => {
    const tolerance = 1.0E-6;
    let numerator = decimal;
    let denominator = 1;

    while (Math.abs(numerator - Math.round(numerator)) > tolerance) {
        numerator *= 10;
        denominator *= 10;
    }

    numerator = Math.round(numerator);
    return `${numerator}/${denominator}`;
};

const calculatePercentage = () => {
    try {
        const value = parseFloat(currentInput.replace("%", ""));
        currentInput = (value / 100).toString();
        display.textContent = currentInput;
    } catch {
        display.textContent = "Ошибка";
        currentInput = "0";
    }
};

const appendDecimal = () => {
    if (!currentInput.includes(",")) {
        currentInput += ",";
        display.textContent = currentInput;
    }
};

const processCommaInput = () => {
    if (currentInput.includes(",")) {
        currentInput = currentInput.replace(",", ".");
    }
};

const calculate = () => {
    try {
        currentInput = currentInput.replace(",", ".");

        const regex = /(\d+\/\d+)/g;
        const updatedInput = currentInput.replace(regex, fraction =>
            fractionToDecimal(fraction).toString()
        );

        const result = eval(updatedInput);
        historyContent.innerHTML += `<div>${currentInput} = ${result}</div>`;
        currentInput = result.toString();
        display.textContent = currentInput;
        display.classList.remove("error");
    } catch {
        display.textContent = "Ошибка";
        display.classList.add("error");
        currentInput = "0";
    }
};

// Очистка истории
clearHistoryBtn.addEventListener("click", () => {
    historyContent.innerHTML = "";
});

// Добавление значения в дисплей
const appendToDisplay = (value) => {
    if (currentInput === "0" && value !== ".") {
        currentInput = value;
    } else {
        currentInput += value;
    }

    display.textContent = currentInput;

    // Пасхалка: запуск игры динозаврик
    if (currentInput.toUpperCase().includes("2-0-0-4")) {
        launchDinoGame();
    }
};

// переход на динозаврика
const launchDinoGame = () => {
    window.location.href = "/dino/dino.html";
};
