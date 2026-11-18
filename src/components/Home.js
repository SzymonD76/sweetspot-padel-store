import React from 'react';
import { useNavigate } from 'react-router-dom';
import { testimonials, racketStyles, brands } from '../data/homeData';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

const TOP_RATED_MIN_RATING = 4.7;
const TOP_RATED_COUNT = 4;

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const topRatedProducts = products
    .filter(p => p.rating >= TOP_RATED_MIN_RATING)
    .slice(0, TOP_RATED_COUNT);

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="container hero-content">
          <h2 className="hero-title">
            Own The Court.<br />
            <span>Master Your Game.</span>
          </h2>
          <p className="hero-subtitle">
            Premium padel equipment for those who never settle for less than the perfect shot.
            Explore our curated selection of top-tier rackets.
          </p>
          <button
            className="btn-primary btn-large"
            onClick={() => navigate('/shop')}
          >
            Explore The Shop
          </button>
        </div>
        <div className="hero-bg-letter" aria-hidden="true">S</div>
      </section>

      {/* ── BEST RATED ── */}
      <section className="section-best-rated">
        <div className="container">
          <h3 className="section-title">Best Rated Rackets</h3>
          {loading && <p className="shop-status-msg">Loading products...</p>}
          {error && <p className="shop-status-msg shop-status-msg--error">{error}</p>}
          <div className="top-rated-grid">
            {topRatedProducts.map(product => (
              <div key={product.id} className="product-card product-card--rated">
                <div className="product-image-placeholder">
                  {product.image_url ? (
                    <img loading="lazy" src={product.image_url} alt={product.name} />
                  ) : (
                    <span className="product-no-image">No image</span>
                  )}
                </div>
                <div className="product-rating">
                  <span className="star">★</span> {product.rating}
                </div>
                <h4 className="product-title">{product.name}</h4>
                <p className="product-price">${product.price}</p>
                <button
                  className="btn-primary btn-add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-quotes">
        <div className="container">
          <h3 className="section-title section-title--light">What Our Players Say</h3>
          <div className="quotes-grid">
            {testimonials.map(t => (
              <div key={t.id} className="quote-card">
                <p className="quote-text">"{t.quote}"</p>
                <div className="quote-footer">
                  <span className="quote-player">— {t.author}, {t.level}</span>
                  <span className="quote-racket">Using: {t.racket}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RACKET SHAPES GUIDE ── */}
      <section className="section-shapes">
        <div className="container">
          <h3 className="section-title">Racket Shapes Guide</h3>
          <div className="shape-grid">
            {racketStyles.map(style => (
              <div key={style.shape} className="shape-card">
                <div className="shape-image-box">
                  <img
                    loading="lazy"
                    src={`${process.env.PUBLIC_URL}/images/${style.shape.toLowerCase()}.webp`}
                    alt={`${style.shape} racket`}
                    className="shape-image"
                  />
                </div>

                <h4 className="shape-name">{style.shape}</h4>
                <p className="shape-target"><strong>Ideal for:</strong> {style.target}</p>
                <p className="shape-desc">{style.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BRANDS ── */}
      <section className="brands-section">
        <div className="container">
          <h3 className="section-title brands-title">Trusted Brands</h3>
          <div className="brands-container">
            {brands.map(brand => (
              <div key={brand} className="brand-item">{brand}</div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
