import Decimal from 'decimal.js';

export function formatNumber(num) {
  if (num === '' || num === null) return '0';
  if (num.toString().endsWith('.')) return num.toString();
  const decimal = new Decimal(num);
  return decimal.abs().gte(1e9) || (decimal.abs().lt(1e-6) && !decimal.isZero())
    ? decimal.toExponential(2)
    : decimal.toDecimalPlaces(6).toFixed();
}
