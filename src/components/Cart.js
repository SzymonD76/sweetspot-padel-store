import React from 'react';
import { useCart } from '../context/CartContext';
import ItemThumb from './ItemThumb';

const Cart = ({ onClose, onCheckout }) => {
  const { cartItems, totals, increaseQuantity, removeFromCart, removeAllFromCart } = useCart();

  return (
    <div className="cart-panel">

      <div className="cart-panel-header">
        <div className="cart-header-left">
          <h2 className="cart-panel-title">Your Cart</h2>
          {totals.itemCount > 0 && (
            <span className="cart-item-count">{totals.itemCount}</span>
          )}
        </div>
        <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">✕</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p className="cart-empty-title">Your cart is empty</p>
          <p className="cart-empty-sub">Add some rackets to get started</p>
          <button className="cart-empty-cta" onClick={onClose}>Browse products</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <ItemThumb src={item.image_url} alt={item.name} />
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-shape">{item.shape} · {item.level}</span>
                  <div className="cart-item-qty-row">
                    <button
                      className="cart-qty-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeAllFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-panel-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-amount">${totals.subtotal.toFixed(2)}</span>
            </div>
            <p className="cart-taxes-note">Taxes and shipping calculated at checkout</p>
            <button className="btn-checkout" onClick={onCheckout}>Checkout</button>
            <button className="btn-continue-shopping" onClick={onClose}>Continue shopping</button>
          </div>
        </>
      )}

    </div>
  );
};

export default Cart;
