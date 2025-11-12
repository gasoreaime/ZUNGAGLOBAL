// src/pages/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-animation">
          <div className="error-code">404</div>
          <div className="error-emoji">😵</div>
        </div>
        
        <div className="not-found-content">
          <h1 className="error-title">Oops! Page Not Found</h1>
          <p className="error-message">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="home-btn">
              🏠 Back to Home
            </Link>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Try Again
            </button>
          </div>
          
          <div className="fun-message">
            <p>While you're here, why not explore our amazing products? 🛍️</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;