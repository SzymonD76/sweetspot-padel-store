import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Checkout from './Checkout';
import { CartProvider } from '../context/CartContext';
import { sendOrderConfirmation } from '../services/emailService';

jest.mock('../services/emailService');

const racket = { id: 1, name: 'Test Racket', shape: 'Round', level: 'Beginner', price: 100 };

const renderCheckout = (cartItems = [{ ...racket, quantity: 1 }]) => {
  localStorage.setItem('sweetspot_cart', JSON.stringify(cartItems));
  return render(
    <CartProvider>
      <MemoryRouter
        initialEntries={['/checkout']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/checkout" element={<Checkout onBackToShop={() => {}} />} />
          <Route path="/shop" element={<p>Shop page</p>} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
};

const fillField = (label, value) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const fillValidForm = ({ cardNumber = '4242424242424242' } = {}) => {
  fillField('First name', 'Jan');
  fillField('Last name', 'Kowalski');
  fillField('Email address', 'jan@example.com');
  fillField('Address', 'Main Street 1');
  fillField('Postal code', '00-001');
  fillField('City', 'Warsaw');
  fillField('Card number', cardNumber);
  fillField('MM / YY', '1299');
  fillField('CVV', '123');
};

beforeEach(() => {
  localStorage.clear();
});

test('redirects to the shop when the cart is empty', () => {
  renderCheckout([]);

  expect(screen.getByText('Shop page')).toBeInTheDocument();
});

test('places an order, sends the confirmation and shows the order summary', async () => {
  sendOrderConfirmation.mockResolvedValue({ status: 200 });
  renderCheckout();

  fillValidForm();
  fireEvent.click(screen.getByRole('button', { name: 'Pay $109.99' }));

  expect(await screen.findByText(/thank you for your order/i)).toBeInTheDocument();
  expect(screen.getByText('$109.99')).toBeInTheDocument();
  expect(sendOrderConfirmation).toHaveBeenCalledWith(
    expect.objectContaining({ email: 'jan@example.com', customerName: 'Jan Kowalski', total: 109.99 })
  );
  expect(JSON.parse(localStorage.getItem('sweetspot_cart'))).toEqual([]);
});

test('does not send the order when the card number is invalid', () => {
  renderCheckout();

  fillValidForm({ cardNumber: '1234567812345678' });
  fireEvent.click(screen.getByRole('button', { name: /pay/i }));

  expect(screen.getByText(/valid 16-digit card number/i)).toBeInTheDocument();
  expect(sendOrderConfirmation).not.toHaveBeenCalled();
});

test('keeps the cart and shows an error when the confirmation e-mail fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  sendOrderConfirmation.mockRejectedValue(new Error('Network error'));
  renderCheckout();

  fillValidForm();
  fireEvent.click(screen.getByRole('button', { name: /pay/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/could not process your order/i);
  expect(JSON.parse(localStorage.getItem('sweetspot_cart'))).toHaveLength(1);
});
