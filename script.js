// Basic math functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b !== 0 ? a / b : "Error: Division by zero";

// Variables to store calculator state
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Function to update display
function updateDisplay() {
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}

// Function to handle number input
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to handle decimal input
function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

// Function to handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(operator, firstOperand, inputValue);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Function to handle percentage calculations
function handlePercentage() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        if (firstOperand !== null && operator) {
            // If there's a pending operation, calculate percentage of the first operand
            const percentValue = (firstOperand * currentValue) / 100;
            displayValue = percentValue.toString();
        } else {
            // If no pending operation, just convert current value to percentage
            displayValue = (currentValue / 100).toString();
        }
    }
}

// Function to perform calculation
function operate(op, a, b) {
    switch (op) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '×': return multiply(a, b);
        case '÷': return divide(a, b);
        default: return b;
    }
}

// Function to reset calculator
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Function to handle backspace
function handleBackspace() {
    displayValue = displayValue.slice(0, -1) || '0';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');
    calculator.addEventListener('click', event => {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('operator')) {
            handleOperator(target.textContent);
            updateDisplay();
            return;
        }

        if (target.classList.contains('decimal')) {
            inputDecimal();
            updateDisplay();
            return;
        }

        if (target.classList.contains('clear')) {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (target.classList.contains('backspace')) {
            handleBackspace();
            updateDisplay();
            return;
        }

        if (target.classList.contains('equals')) {
            handleOperator('=');
            updateDisplay();
            return;
        }

        if (target.classList.contains('percentage')) {
            handlePercentage();
            updateDisplay();
            return;
        }

        inputDigit(target.textContent);
        updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    const key = event.key;
    if (/\d/.test(key)) {
        event.preventDefault();
        inputDigit(key);
        updateDisplay();
    } else if (key === '.') {
        event.preventDefault();
        inputDecimal();
        updateDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        const operatorMap = { '*': '×', '/': '÷' };
        handleOperator(operatorMap[key] || key);
        updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleOperator('=');
        updateDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        updateDisplay();
    } else if (key === 'Escape') {
        event.preventDefault();
        resetCalculator();
        updateDisplay();
    }else if (key === '%') {
        event.preventDefault();
        handlePercentage();
        updateDisplay();
    }
});