// src/components/ProductPreview/ProductPreview.jsx
import React from 'react';
import './ProductPreview.css';

const ProductPreview = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Smartwatch",
      price: "$199.00",
      image: "⌚",
      category: "Electronics",
      rating: 4.5
    },
    {
      id: 2,
      name: "Wireless Headphone",
      price: "$89.99",
      image: "🎧",
      category: "Electronics",
      rating: 4.3
    },
    {
      id: 3,
      name: "Running Sneaker",
      price: "$38.99",
      image: "👟",
      category: "Fashion",
      rating: 4.7
    },
    {
      id: 4,
      name: "Home Speaker",
      price: "$448.00",
      image: "🏠",
      category: "Electronics",
      rating: 4.8
    }
  ];

  return (
    <section className="product-preview" id="products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Discover our most popular items</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="product-badge">{product.category}</div>
              <div className="product-image">
                <span className="product-emoji">{product.image}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                  <span className="rating-value">({product.rating})</span>
                </div>
                <div className="product-price">{product.price}</div>
              </div>
              <button className="add-to-cart-btn disabled">
                <i className="fas fa-lock"></i>
                Login to add to cart
              </button>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <button className="view-all-btn">
            View All Products
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview; // ✅ Changed to default export