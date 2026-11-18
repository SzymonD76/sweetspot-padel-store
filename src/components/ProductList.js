import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

const shapeOptions = [
  { label: 'All Shapes', value: 'All' },
  { label: 'Round',      value: 'Round' },
  { label: 'Teardrop',   value: 'Teardrop' },
  { label: 'Diamond',    value: 'Diamond' },
];

const levelOptions = [
  { label: 'All Levels',   value: 'All' },
  { label: 'Beginner',     value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced',     value: 'Advanced' },
];

// Background colors for the level tag on each product card
const levelColors = {
  Beginner:     '#22c55e',
  Intermediate: '#f59e0b',
  Advanced:     '#ef4444',
};

// Demo pricing rule: rackets above the threshold are shown as discounted by 20%
const SALE_PRICE_THRESHOLD = 200;
const SALE_DISCOUNT = 0.2;
const isOnSale = (product) => product.price > SALE_PRICE_THRESHOLD;
const getOriginalPrice = (price) => Math.round(price / (1 - SALE_DISCOUNT));

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const [shapeFilter, setShapeFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const { addToCart } = useCart();

  // Filter the products based on the selected shape and level
  const filteredProducts = products.filter(product => {
    const matchesShape = shapeFilter === 'All' || product.shape === shapeFilter;
    const matchesLevel = levelFilter === 'All' || product.level === levelFilter;
    return matchesShape && matchesLevel;
  });

  if (loading) {
    return <p className="shop-status-msg">Loading products...</p>;
  }

  if (error) {
    return <p className="shop-status-msg shop-status-msg--error">{error}</p>;
  }

  return (
    <div className="shop-page">

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-group-label">Shape</span>
          <div className="filter-pills">
            {shapeOptions.map(opt => (
              <button
                key={opt.value}
                className={`filter-pill ${shapeFilter === opt.value ? 'active' : ''}`}
                onClick={() => setShapeFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <span className="filter-group-label">Level</span>
          <div className="filter-pills">
            {levelOptions.map(opt => (
              <button
                key={opt.value}
                className={`filter-pill ${levelFilter === opt.value ? 'active' : ''}`}
                onClick={() => setLevelFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">

              {isOnSale(product)     && <span className="badge badge-left">SALE</span>}
              {product.isRecommended && <span className="badge badge-right">RECOMMENDED</span>}

              <div className="product-image-placeholder">
                {product.image_url ? (
                  <img loading="lazy" src={product.image_url} alt={product.name} />
                ) : (
                  <span className="product-no-image">No image</span>
                )}
              </div>

              <div className="product-rating">
                <span className="star-icon">★</span>
                {product.rating}
                <span className="review-count">({product.reviews})</span>
                <span
                  className="product-level-tag"
                  style={{ backgroundColor: levelColors[product.level] }}
                >
                  {product.level}
                </span>
              </div>

              <h3 className="product-title">{product.name} ({product.shape})</h3>

              <div className="product-price-row">
                <p className="product-price">${product.price}</p>
                {isOnSale(product) && (
                  <>
                    <p className="product-price-old">${getOriginalPrice(product.price)}</p>
                    <span className="product-discount">-{SALE_DISCOUNT * 100}%</span>
                  </>
                )}
              </div>

              <button
                className="btn-primary btn-add-to-cart"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

            </div>
          ))
        ) : (
          <p className="no-results">No rackets found matching your criteria.</p>
        )}
      </div>

    </div>
  );
};

export default ProductList;
