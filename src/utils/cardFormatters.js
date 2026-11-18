// formatters for credit card input fields — used in Checkout.js and managed by useCheckoutForm.js
export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

// MM/YY format for expiry date, auto-inserts slash after month
export const formatExpiry = (value, prevValue) => {
  const raw = value.replace(/\D/g, '').slice(0, 4);
  if (raw.length >= 3) {
    return raw.slice(0, 2) + '/' + raw.slice(2);
  }
  if (raw.length === 2 && prevValue.length === 1) {
    return raw + '/';
  }
  return raw;
};

// Only digits, max 3 characters for CVV
export const formatCvv = (value) => {
  return value.replace(/\D/g, '').slice(0, 3);
};
