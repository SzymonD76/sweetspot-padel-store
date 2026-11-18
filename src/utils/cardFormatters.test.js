import { formatCardNumber, formatExpiry, formatCvv } from './cardFormatters';

describe('formatCardNumber', () => {
  it('groups digits in blocks of four', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
  });

  it('strips non-digit characters and limits the number to 16 digits', () => {
    expect(formatCardNumber('4242-4242 abc 42424242 4242 9999')).toBe('4242 4242 4242 4242');
  });
});

describe('formatExpiry', () => {
  it('adds a slash after the month while typing', () => {
    expect(formatExpiry('12', '1')).toBe('12/');
  });

  it('formats a full date as MM/YY', () => {
    expect(formatExpiry('1228', '12/2')).toBe('12/28');
  });

  it('lets the user delete the slash', () => {
    expect(formatExpiry('12', '12/')).toBe('12');
  });
});

describe('formatCvv', () => {
  it('keeps only the first three digits', () => {
    expect(formatCvv('1a2b34')).toBe('123');
  });
});
