import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    // Get cart items count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          🏀 ZungaGlobal
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Inketo</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Ibyerekeye</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Twandikire</a>
        </nav>

        {/* User & Cart */}
        <div className="user-cart">
          {currentUser ? (
            <div className="logged-in">
              <span className="username">👤 {currentUser.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="guest-links">
              <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-register" onClick={() => navigate('/register')}>Register</button>
            </div>
          )}

          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
