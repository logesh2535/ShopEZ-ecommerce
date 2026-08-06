export const CURRENCY_SYMBOL = '₹';

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${CURRENCY_SYMBOL}0.00`;
  const num = Number(amount);
  return `${CURRENCY_SYMBOL}${num.toFixed(2)}`;
};
