export const CURRENCY_SYMBOL = '₹';

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = DEFAULT_PRODUCT_IMAGE;
};

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${CURRENCY_SYMBOL}0.00`;
  const num = Number(amount);
  return `${CURRENCY_SYMBOL}${num.toFixed(2)}`;
};
