export function fractionToDecimal(fraction) {
  const [numerator, denominator] = fraction
    .split('/')
    .map(n => parseFloat(n.replace(",", ".")));
  if (denominator === 0) throw new Error("Деление на ноль");
  return numerator / denominator;
}

export function calculateExpression(input) {
  const processed = input.replace(/,/g, ".");
  const regex = /[0-9.]+\/[0-9.]+/g;
  const evaluated = processed.replace(regex, match =>
    fractionToDecimal(match).toString()
  );
  return eval(evaluated);
}
