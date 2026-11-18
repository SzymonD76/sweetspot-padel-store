import { useState, useCallback } from 'react';
import { formatCardNumber, formatExpiry, formatCvv } from '../utils/cardFormatters';

const INITIAL_FORM = {
  country:      'Poland',
  firstName:    '',
  lastName:     '',
  email:        '',
  address:      '',
  apartment:    '',
  postalCode:   '',
  city:         '',
  phone:        '',
  cardNumber:   '',
  expiry:       '',
  cvv:          '',
  discountCode: '',
};

// Custom hook to manage checkout form state and formatting logic
export const useCheckoutForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);

  // Generic handler for text inputs — updates form state based on input name and value
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Specific handlers for card fields that apply formatting as the user types
  const handleCardNumber = useCallback((e) => {
    setForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }));
  }, []);

  const handleExpiry = useCallback((e) => {
    setForm(prev => ({
      ...prev,
      expiry: formatExpiry(e.target.value, prev.expiry),
    }));
  }, []);

  const handleCvv = useCallback((e) => {
    setForm(prev => ({ ...prev, cvv: formatCvv(e.target.value) }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
  }, []);

  return { form, handleChange, handleCardNumber, handleExpiry, handleCvv, resetForm };
};
