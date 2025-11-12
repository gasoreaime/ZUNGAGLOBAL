// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Column */}
          <div className="footer-column brand-column">
            <div className="footer-logo">
              <img 
                src="/images/logo.png" 
                alt="ZungaGlobal" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="logo-fallback">ZUNGA GLOBAL</span>
            </div>
            <p className="footer-description">
              Your trusted partner for quality products and exceptional shopping experience. 
              Shop smart, shop easy with ZungaGlobal.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#deals">Today's Deals</a></li>
              <li><a href="#trending">Trending</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-column">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#support">Support Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column newsletter-column">
            <h3 className="footer-title">Stay Updated</h3>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="payment-methods">
              <p className="payment-title">We Accept:</p>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-paypal"></i>
                <i className="fab fa-cc-apple-pay"></i>
                <i className="fab fa-cc-amazon-pay"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2025 ZungaGlobal. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; // ✅ Changed to default export