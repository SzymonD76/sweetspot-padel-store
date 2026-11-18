import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const racket = { id: 1, name: 'Test Racket', price: 100 };
const balls = { id: 2, name: 'Padel Balls', price: 10.5 };

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
const renderCart = () => renderHook(() => useCart(), { wrapper });

beforeEach(() => {
  localStorage.clear();
});

test('adds new products and increases the quantity of existing ones', () => {
  const { result } = renderCart();

  act(() => {
    result.current.addToCart(racket);
    result.current.addToCart(racket);
    result.current.addToCart(balls);
  });

  expect(result.current.cartItems).toEqual([
    { ...racket, quantity: 2 },
    { ...balls, quantity: 1 },
  ]);
  expect(result.current.totals).toEqual({ itemCount: 3, subtotal: 210.5 });
});

test('removeFromCart decreases the quantity and removes the item at zero', () => {
  const { result } = renderCart();

  act(() => {
    result.current.addToCart(racket);
    result.current.increaseQuantity(racket.id);
  });
  act(() => result.current.removeFromCart(racket.id));
  expect(result.current.cartItems[0].quantity).toBe(1);

  act(() => result.current.removeFromCart(racket.id));
  expect(result.current.cartItems).toEqual([]);
});

test('removeAllFromCart and clearCart empty the cart', () => {
  const { result } = renderCart();

  act(() => {
    result.current.addToCart(racket);
    result.current.addToCart(racket);
    result.current.addToCart(balls);
  });
  act(() => result.current.removeAllFromCart(racket.id));
  expect(result.current.cartItems).toEqual([{ ...balls, quantity: 1 }]);

  act(() => result.current.clearCart());
  expect(result.current.totals).toEqual({ itemCount: 0, subtotal: 0 });
});

test('persists the cart in localStorage between sessions', () => {
  const first = renderCart();
  act(() => first.result.current.addToCart(racket));
  first.unmount();

  const second = renderCart();
  expect(second.result.current.cartItems).toEqual([{ ...racket, quantity: 1 }]);
});

test('useCart throws a helpful error outside of CartProvider', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
});
