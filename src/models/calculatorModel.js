export function fractionToDecimal(fraction) {
    const [numerator, denominator] = fraction.split('/').map(Number);
    if (denominator === 0) throw new Error("Деление на ноль!");
    return numerator / denominator;
  }
  
  export function calculateExpression(input) {
    const processed = input.replace(",", ".");
    const regex = /(\d+\/\d+)/g;
    const evaluated = processed.replace(regex, match =>
      fractionToDecimal(match).toString()
    );
    return eval(evaluated);
  }
  