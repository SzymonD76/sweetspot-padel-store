import {
  isValidEmail,
  isValidCardNumber,
  isValidExpiry,
  isValidCvv,
  validateCheckoutForm,
} from './validators';

describe('isValidEmail', () => {
  it.each(['name@example.com', ' john.doe@mail.co.uk '])('accepts %p', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'name', 'name@example', 'name @example.com'])('rejects %p', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe('isValidCardNumber', () => {
  it('accepts a 16-digit number that passes the Luhn check', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true);
  });

  it('rejects a number with a wrong check digit', () => {
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false);
  });

  it('rejects numbers that are too short', () => {
    expect(isValidCardNumber('4242 4242')).toBe(false);
  });
});

describe('isValidExpiry', () => {
  const now = new Date(2026, 10, 18); // 18 November 2026

  it('accepts the current month and future dates', () => {
    expect(isValidExpiry('11/26', now)).toBe(true);
    expect(isValidExpiry('01/27', now)).toBe(true);
  });

  it('rejects past dates', () => {
    expect(isValidExpiry('10/26', now)).toBe(false);
    expect(isValidExpiry('12/25', now)).toBe(false);
  });

  it('rejects invalid months and formats', () => {
    expect(isValidExpiry('13/27', now)).toBe(false);
    expect(isValidExpiry('00/27', now)).toBe(false);
    expect(isValidExpiry('1/27', now)).toBe(false);
  });
});

describe('isValidCvv', () => {
  it('requires exactly three digits', () => {
    expect(isValidCvv('123')).toBe(true);
    expect(isValidCvv('12')).toBe(false);
  });
});

describe('validateCheckoutForm', () => {
  const validForm = {
    email: 'name@example.com',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/99',
    cvv: '123',
  };

  it('returns no errors for a valid form', () => {
    expect(validateCheckoutForm(validForm)).toEqual({});
  });

  it('returns an error for every invalid field', () => {
    const errors = validateCheckoutForm({ email: 'nope', cardNumber: '1234', expiry: '99/99', cvv: '' });
    expect(Object.keys(errors).sort()).toEqual(['cardNumber', 'cvv', 'email', 'expiry']);
  });
});
