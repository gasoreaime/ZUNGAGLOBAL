// src/components/CallToAction/CallToAction.jsx
import React from 'react';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Create your free account to unlock <span className="highlight">exclusive discounts</span> and faster checkout!
          </h2>
          <p className="cta-subtitle">
            Join our community of smart shoppers and enjoy benefits like:
          </p>
          <div className="cta-features">
            <div className="feature">
              <i className="fas fa-tag"></i>
              <span>Exclusive Member Discounts</span>
            </div>
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <span>Free Shipping on Orders $50+</span>
            </div>
            <div className="feature">
              <i className="fas fa-clock"></i>
              <span>Faster Checkout Process</span>
            </div>
            <div className="feature">
              <i className="fas fa-gift"></i>
              <span>Early Access to Sales</span>
            </div>
          </div>
          <div className="cta-buttons">
            <button className="cta-btn primary">
              <i className="fas fa-user-plus"></i>
              Sign Up Now - It's Free!
            </button>
            <button className="cta-btn secondary">
              <i className="fas fa-play-circle"></i>
              Watch Demo
            </button>
          </div>
          <div className="cta-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Members</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8/5</span>
              <span className="stat-label">Customer Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="cta-visual">
          <div className="cta-card card-1">
            <i className="fas fa-rocket"></i>
            <span>Fast Delivery</span>
          </div>
          <div className="cta-card card-2">
            <i className="fas fa-shield-alt"></i>
            <span>Secure Payment</span>
          </div>
          <div className="cta-image">
            <div className="image-placeholder">
              <i className="fas fa-award"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; // ✅ Changed to default export