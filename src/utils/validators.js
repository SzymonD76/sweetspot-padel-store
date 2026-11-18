// Validation helpers for the checkout form

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => EMAIL_PATTERN.test(email.trim());

// Luhn checksum — the standard check digit algorithm used by payment cards
const passesLuhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const isValidCardNumber = (value) => {
  const digits = value.replace(/\s/g, '');
  return /^\d{16}$/.test(digits) && passesLuhn(digits);
};

// Expiry must be in MM/YY format and must not be in the past
export const isValidExpiry = (value, now = new Date()) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const isValidCvv = (value) => /^\d{3}$/.test(value);

// Returns an object with an error message for every invalid field (empty object = form is valid)
export const validateCheckoutForm = (form) => {
  const errors = {};
  if (!isValidEmail(form.email))           errors.email      = 'Please enter a valid email address (e.g. name@example.com).';
  if (!isValidCardNumber(form.cardNumber)) errors.cardNumber = 'Please enter a valid 16-digit card number.';
  if (!isValidExpiry(form.expiry))         errors.expiry     = 'Please enter a valid expiry date (MM/YY).';
  if (!isValidCvv(form.cvv))               errors.cvv        = 'CVV must be 3 digits.';
  return errors;
};
