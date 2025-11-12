// src/components/Hero/Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing Products — <span className="highlight">Shop Smart, Shop Easy.</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of users enjoying fast delivery and quality deals.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-explore">
              <i className="fas fa-shopping-bag"></i>
              Explore Products
            </button>
            <button className="hero-btn hero-btn-login">
              <i className="fas fa-user"></i>
              Login to Continue
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <i className="fas fa-mobile-alt"></i>
            <span>Tech</span>
          </div>
          <div className="floating-card card-2">
            <i className="fas fa-tshirt"></i>
            <span>Fashion</span>
          </div>
          <div className="floating-card card-3">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; // ✅ Changed to default export