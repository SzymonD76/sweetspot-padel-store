import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import { CartProvider } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

jest.mock('../hooks/useProducts');

const products = [
  { id: 1, name: 'Alpha Control', shape: 'Round', level: 'Beginner', price: 120, rating: 4.5, reviews: 10 },
  { id: 2, name: 'Bravo Power', shape: 'Diamond', level: 'Advanced', price: 260, rating: 4.9, reviews: 32 },
];

const renderProductList = () => render(
  <CartProvider>
    <ProductList />
  </CartProvider>
);

beforeEach(() => {
  localStorage.clear();
});

test('shows a loading message while products are being fetched', () => {
  useProducts.mockReturnValue({ products: [], loading: true, error: null });
  renderProductList();

  expect(screen.getByText(/loading products/i)).toBeInTheDocument();
});

test('shows an error message when products cannot be loaded', () => {
  useProducts.mockReturnValue({ products: [], loading: false, error: 'Could not load products.' });
  renderProductList();

  expect(screen.getByText('Could not load products.')).toBeInTheDocument();
});

test('filters products by shape and level', () => {
  useProducts.mockReturnValue({ products, loading: false, error: null });
  renderProductList();

  expect(screen.getByText(/Alpha Control/)).toBeInTheDocument();
  expect(screen.getByText(/Bravo Power/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Diamond' }));
  expect(screen.queryByText(/Alpha Control/)).not.toBeInTheDocument();
  expect(screen.getByText(/Bravo Power/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Beginner' }));
  expect(screen.getByText(/no rackets found/i)).toBeInTheDocument();
});

test('marks expensive rackets as on sale with a 20% discount', () => {
  useProducts.mockReturnValue({ products, loading: false, error: null });
  renderProductList();

  expect(screen.getByText('SALE')).toBeInTheDocument();
  expect(screen.getByText('$325')).toBeInTheDocument();
  expect(screen.getByText('-20%')).toBeInTheDocument();
});
