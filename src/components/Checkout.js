import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { useOrderTotal } from '../hooks/useOrderTotal';
import { validateCheckoutForm } from '../utils/validators';
import { sendOrderConfirmation } from '../services/emailService';
import LogoIcon from './LogoIcon';
import ItemThumb from './ItemThumb';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Fiji',
  'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Guatemala',
  'Guinea','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kosovo',
  'Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Libya','Liechtenstein','Lithuania',
  'Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania',
  'Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique',
  'Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
  'North Macedonia','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia',
  'Senegal','Serbia','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',
];

const generateOrderId = () => Math.floor(100000 + Math.random() * 900000);

const Checkout = ({ onBackToShop }) => {
  const { cartItems, totals, clearCart } = useCart();
  const { form, handleChange, handleCardNumber, handleExpiry, handleCvv } = useCheckoutForm();
  const {
    shippingMethod, setShippingMethod,
    discountCode, setDiscountCode,
    appliedCode, discountPercent, discountError,
    applyDiscount,
    shippingCost, discount, total,
  } = useOrderTotal(totals.subtotal);

  // placedOrder — snapshot of the submitted order, shown on the success screen after the cart is cleared
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSending, setIsSending]     = useState(false);
  const [errors, setErrors]           = useState({});
  const [submitError, setSubmitError] = useState('');

  // Nothing to check out — send the user back to the shop
  if (!placedOrder && cartItems.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateCheckoutForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const order = {
      id: generateOrderId(),
      email: form.email.trim(),
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      deliveryAddress: `${[form.address, form.apartment].filter(Boolean).join(', ')}, ${form.postalCode} ${form.city}, ${form.country}`,
      city: form.city,
      country: form.country,
      shippingMethod,
      items: cartItems,
      total,
    };

    setIsSending(true);
    try {
      await sendOrderConfirmation(order);
      // Order is confirmed only after the e-mail has been sent successfully
      setPlacedOrder(order);
      clearCart();
    } catch (error) {
      console.error('Failed to send order confirmation.', error);
      setSubmitError('We could not process your order. Please try again in a moment.');
    } finally {
      setIsSending(false);
    }
  };

  // ── ORDER SUCCESS SCREEN ──
  if (placedOrder) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-icon">✓</div>
        <h2 className="checkout-success-title">Thank you for your order!</h2>
        <p className="checkout-success-sub">
          Order <strong>#{placedOrder.id}</strong> is being processed. A confirmation has been sent to{' '}
          <strong>{placedOrder.email}</strong>.
        </p>
        <div className="checkout-success-details">
          <div className="checkout-success-line">
            <span>Order total</span>
            <span>${placedOrder.total.toFixed(2)}</span>
          </div>
          <div className="checkout-success-line">
            <span>Shipping to</span>
            <span>{placedOrder.city}, {placedOrder.country}</span>
          </div>
          <div className="checkout-success-line">
            <span>Delivery</span>
            <span>{placedOrder.shippingMethod === 'express' ? 'Express 1–2 days' : 'Standard 3–5 days'}</span>
          </div>
        </div>
        <button className="checkout-success-btn" onClick={onBackToShop}>
          Back to shop
        </button>
      </div>
    );
  }

  // ── CHECKOUT FORM ──
  return (
    <div className="checkout-page">

      <div className="checkout-topbar">
        <button className="checkout-back-btn" onClick={onBackToShop}>
          Back to shop
        </button>
        <div className="checkout-logo">
          <LogoIcon size={22} />
          <span className="checkout-logo-text">
            <span className="checkout-logo-sweet">Sweet</span>
            <span className="checkout-logo-spot">Spot</span>
          </span>
        </div>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>

        <div className="checkout-form-col">

          {/* ── DELIVERY ── */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Delivery</h2>

            <div className="checkout-field checkout-field--select">
              <label htmlFor="checkout-country" className="checkout-static-label">Country / Region</label>
              <select
                id="checkout-country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="checkout-select"
                autoComplete="country-name"
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <input id="checkout-firstName" type="text" name="firstName" value={form.firstName}
                  onChange={handleChange} placeholder=" " className="checkout-input"
                  autoComplete="given-name" required />
                <label htmlFor="checkout-firstName" className="checkout-floating-label">First name</label>
              </div>
              <div className="checkout-field">
                <input id="checkout-lastName" type="text" name="lastName" value={form.lastName}
                  onChange={handleChange} placeholder=" " className="checkout-input"
                  autoComplete="family-name" required />
                <label htmlFor="checkout-lastName" className="checkout-floating-label">Last name</label>
              </div>
            </div>

            <div className="checkout-field">
              <input id="checkout-email" type="email" name="email" value={form.email}
                onChange={handleChange} placeholder=" " className="checkout-input"
                autoComplete="email" required aria-invalid={Boolean(errors.email)} />
              <label htmlFor="checkout-email" className="checkout-floating-label">Email address</label>
            </div>
            {errors.email && <p className="checkout-field-error">{errors.email}</p>}

            <div className="checkout-field">
              <input id="checkout-address" type="text" name="address" value={form.address}
                onChange={handleChange} placeholder=" " className="checkout-input"
                autoComplete="address-line1" required />
              <label htmlFor="checkout-address" className="checkout-floating-label">Address</label>
            </div>

            <div className="checkout-field">
              <input id="checkout-apartment" type="text" name="apartment" value={form.apartment}
                onChange={handleChange} placeholder=" " className="checkout-input"
                autoComplete="address-line2" />
              <label htmlFor="checkout-apartment" className="checkout-floating-label">Apartment, suite, etc. (optional)</label>
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <input id="checkout-postalCode" type="text" name="postalCode" value={form.postalCode}
                  onChange={handleChange} placeholder=" " className="checkout-input"
                  autoComplete="postal-code" required />
                <label htmlFor="checkout-postalCode" className="checkout-floating-label">Postal code</label>
              </div>
              <div className="checkout-field">
                <input id="checkout-city" type="text" name="city" value={form.city}
                  onChange={handleChange} placeholder=" " className="checkout-input"
                  autoComplete="address-level2" required />
                <label htmlFor="checkout-city" className="checkout-floating-label">City</label>
              </div>
            </div>

            <div className="checkout-field">
              <input id="checkout-phone" type="tel" name="phone" value={form.phone}
                onChange={handleChange} placeholder=" " className="checkout-input"
                autoComplete="tel" />
              <label htmlFor="checkout-phone" className="checkout-floating-label">Phone (optional)</label>
            </div>
          </section>

          {/* ── SHIPPING METHOD ── */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Shipping method</h2>
            {!form.city ? (
              <div className="checkout-shipping-placeholder">
                Enter your shipping address to view available shipping methods.
              </div>
            ) : (
              <div className="checkout-shipping-options">
                <label className={`checkout-shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                  <input type="radio" name="shipping" value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')} />
                  <div className="checkout-shipping-info">
                    <span className="checkout-shipping-name">Standard shipping</span>
                    <span className="checkout-shipping-eta">3–5 business days</span>
                  </div>
                  <span className="checkout-shipping-price">$9.99</span>
                </label>
                <label className={`checkout-shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}>
                  <input type="radio" name="shipping" value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')} />
                  <div className="checkout-shipping-info">
                    <span className="checkout-shipping-name">Express shipping</span>
                    <span className="checkout-shipping-eta">1–2 business days</span>
                  </div>
                  <span className="checkout-shipping-price">$19.99</span>
                </label>
              </div>
            )}
          </section>

          {/* ── PAYMENT ── */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Payment</h2>
            <p className="checkout-payment-note">
              Demo store — no real payment is processed. Use the test card <strong>4242 4242 4242 4242</strong>.
            </p>
            <div className="checkout-payment-box">
              <div className="checkout-payment-header">
                <div className="checkout-payment-method-label">
                  <div className="checkout-radio-dot" />
                  Credit card
                </div>
                <div className="checkout-card-icons" aria-hidden="true">
                  <svg className="card-logo" viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="16" rx="3" fill="#1A1F71"/>
                    <text x="6" y="12" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">VISA</text>
                  </svg>
                  <svg className="card-logo" viewBox="0 0 48 30" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="30" rx="4" fill="#252525"/>
                    <circle cx="18" cy="15" r="10" fill="#EB001B"/>
                    <circle cx="30" cy="15" r="10" fill="#F79E1B"/>
                    <path d="M24 7.8a10 10 0 0 1 0 14.4A10 10 0 0 1 24 7.8z" fill="#FF5F00"/>
                  </svg>
                </div>
              </div>

              <div className="checkout-field checkout-field--inside">
                <input id="checkout-cardNumber" type="text" name="cardNumber" value={form.cardNumber}
                  onChange={handleCardNumber} placeholder=" " className="checkout-input"
                  inputMode="numeric" autoComplete="cc-number" maxLength={19} required
                  aria-invalid={Boolean(errors.cardNumber)} />
                <label htmlFor="checkout-cardNumber" className="checkout-floating-label">Card number</label>
                <span className="checkout-input-icon" aria-hidden="true">🔒</span>
              </div>

              <div className="checkout-row">
                <div className="checkout-field checkout-field--inside">
                  <input id="checkout-expiry" type="text" name="expiry" value={form.expiry}
                    onChange={handleExpiry} placeholder=" " className="checkout-input"
                    inputMode="numeric" autoComplete="cc-exp" maxLength={5} required
                    aria-invalid={Boolean(errors.expiry)} />
                  <label htmlFor="checkout-expiry" className="checkout-floating-label">MM / YY</label>
                </div>
                <div className="checkout-field checkout-field--inside">
                  <input id="checkout-cvv" type="text" name="cvv" value={form.cvv}
                    onChange={handleCvv} placeholder=" " className="checkout-input"
                    inputMode="numeric" autoComplete="cc-csc" maxLength={3} required
                    aria-invalid={Boolean(errors.cvv)} />
                  <label htmlFor="checkout-cvv" className="checkout-floating-label">CVV</label>
                </div>
              </div>
            </div>
            {['cardNumber', 'expiry', 'cvv'].map(field => errors[field] && (
              <p key={field} className="checkout-field-error">{errors[field]}</p>
            ))}
          </section>

          {submitError && <p className="checkout-field-error" role="alert">{submitError}</p>}

          <button type="submit" className="checkout-submit-btn" disabled={isSending}>
            {isSending ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>

        </div>

        {/* ── ORDER SUMMARY (right column) ── */}
        <div className="checkout-summary-col">
          <div className="checkout-summary">

            <h3 className="checkout-summary-title">
              Order summary · {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
            </h3>

            <div className="checkout-summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-summary-item-img">
                    <span className="checkout-item-qty-badge">{item.quantity}</span>
                    <ItemThumb src={item.image_url} alt={item.name} />
                  </div>
                  <div className="checkout-summary-item-info">
                    <span className="checkout-summary-item-name">{item.name}</span>
                    <span className="checkout-summary-item-shape">{item.shape} · {item.level}</span>
                  </div>
                  <span className="checkout-summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-discount-row">
              <input
                type="text"
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
                placeholder="Discount code or gift card"
                aria-label="Discount code"
                className="checkout-discount-input"
              />
              <button type="button" className="checkout-discount-btn" onClick={applyDiscount}>
                Apply
              </button>
            </div>
            {discountError && (
              <p className="checkout-discount-error">{discountError}</p>
            )}
            {appliedCode && (
              <p className="checkout-discount-success">
                Code {appliedCode} applied — {Math.round(discountPercent * 100)}% off!
              </p>
            )}

            <div className="checkout-summary-totals">
              <div className="checkout-summary-line">
                <span>Subtotal · {totals.itemCount} items</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-summary-line">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {appliedCode && (
                <div className="checkout-summary-line checkout-summary-line--discount">
                  <span>Discount ({appliedCode})</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>
              <div className="checkout-summary-total-right">
                <span className="checkout-currency">USD</span>
                <span className="checkout-total-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {appliedCode && (
              <div className="checkout-savings-badge">
                Total savings: ${discount.toFixed(2)}
              </div>
            )}

          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
