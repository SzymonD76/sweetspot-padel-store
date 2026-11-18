import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import LogoIcon from './components/LogoIcon';
import { useCart } from './context/CartContext';

// Opt in to React Router v7 behaviour early (removes deprecation warnings)
const ROUTER_FUTURE_FLAGS = { v7_startTransition: true, v7_relativeSplatPath: true };

// Header — logo, navigation links (NavLink highlights the active page) and the cart button with an item count badge
const Header = ({ onCartOpen }) => {
  const { totals } = useCart();

  return (
    <header className="site-header">
      <Link to="/" className="site-logo-wrapper" aria-label="SweetSpot — home page">
        <LogoIcon size={28} />
        <h1 className="site-logo">
          <span className="logo-sweet">Sweet</span>
          <span className="logo-spot">Spot</span>
        </h1>
      </Link>

      <nav className="site-nav">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/shop" className="nav-link">Shop</NavLink>
        <button className="cart-button" onClick={onCartOpen}>
          <span className="cart-button-icon" aria-hidden="true">🛒</span>
          <span className="cart-button-text">Cart</span>
          {totals.itemCount > 0 && (
            <span className="cart-button-badge">{totals.itemCount}</span>
          )}
        </button>
      </nav>
    </header>
  );
};

// Main layout — header, routes and the cart drawer
function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckout = location.pathname === '/checkout';

  // Close the cart drawer with the Escape key
  useEffect(() => {
    if (!cartOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cartOpen]);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="App">

      {!isCheckout && <Header onCartOpen={() => setCartOpen(true)} />}

      <main>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/shop"     element={<ProductList />} />
          <Route path="/checkout" element={<Checkout onBackToShop={() => navigate('/shop')} />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            onClick={e => e.stopPropagation()}
          >
            <Cart
              onClose={() => setCartOpen(false)}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
