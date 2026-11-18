import { useState, useCallback } from 'react';

export const SHIPPING_RATES = {
  standard: 9.99,
  express:  19.99,
};

// Demo discount codes. A real store would validate codes on the server.
export const DISCOUNT_CODES = {
  SWEETSPOT10: 0.10,
};

const roundToCents = (value) => Math.round(value * 100) / 100;

// Calculates shipping, discount and the final order total for a given cart subtotal
export const useOrderTotal = (subtotal) => {
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [discountCode, setDiscountCode]     = useState('');
  const [appliedCode, setAppliedCode]       = useState(null);
  const [discountError, setDiscountError]   = useState('');

  const discountPercent = appliedCode ? DISCOUNT_CODES[appliedCode] : 0;
  const shippingCost    = SHIPPING_RATES[shippingMethod];
  const discount        = roundToCents(subtotal * discountPercent);
  const total           = roundToCents(subtotal + shippingCost - discount);

  const applyDiscount = useCallback(() => {
    const code = discountCode.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setAppliedCode(code);
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code.');
    }
  }, [discountCode]);

  return {
    shippingMethod,
    setShippingMethod,
    discountCode,
    setDiscountCode,
    appliedCode,
    discountPercent,
    discountError,
    applyDiscount,
    shippingCost,
    discount,
    total,
  };
};
