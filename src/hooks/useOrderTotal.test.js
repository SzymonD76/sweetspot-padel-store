import { renderHook, act } from '@testing-library/react';
import { useOrderTotal } from './useOrderTotal';

test('uses standard shipping by default', () => {
  const { result } = renderHook(() => useOrderTotal(200));

  expect(result.current.shippingCost).toBe(9.99);
  expect(result.current.total).toBe(209.99);
});

test('recalculates the total for express shipping', () => {
  const { result } = renderHook(() => useOrderTotal(200));

  act(() => result.current.setShippingMethod('express'));

  expect(result.current.total).toBe(219.99);
});

test('applies a valid discount code (case-insensitive) and rounds to cents', () => {
  const { result } = renderHook(() => useOrderTotal(199.99));

  act(() => result.current.setDiscountCode(' sweetspot10 '));
  act(() => result.current.applyDiscount());

  expect(result.current.appliedCode).toBe('SWEETSPOT10');
  expect(result.current.discount).toBe(20);
  expect(result.current.total).toBe(189.98);
});

test('shows an error for an invalid code without applying a discount', () => {
  const { result } = renderHook(() => useOrderTotal(100));

  act(() => result.current.setDiscountCode('FREESTUFF'));
  act(() => result.current.applyDiscount());

  expect(result.current.discountError).toBe('Invalid discount code.');
  expect(result.current.discount).toBe(0);
});

test('keeps the applied code when the input is edited afterwards', () => {
  const { result } = renderHook(() => useOrderTotal(100));

  act(() => result.current.setDiscountCode('SWEETSPOT10'));
  act(() => result.current.applyDiscount());
  act(() => result.current.setDiscountCode('something else'));

  expect(result.current.appliedCode).toBe('SWEETSPOT10');
  expect(result.current.discount).toBe(10);
});
