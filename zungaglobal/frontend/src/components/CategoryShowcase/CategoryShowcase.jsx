// src/components/CategoryShowcase/CategoryShowcase.jsx
import React from 'react';
import './CategoryShowcase.css';

const CategoryShowcase = () => {
  const categories = [
    { id: 1, name: "Electronics", icon: "📱", items: "2K+ Products", color: "#3B82F6" },
    { id: 2, name: "Fashion", icon: "👗", items: "1.5K+ Products", color: "#EF4444" },
    { id: 3, name: "Accessories", icon: "🕶️", items: "800+ Products", color: "#10B981" },
    { id: 4, name: "Home", icon: "🏠", items: "1.2K+ Products", color: "#F59E0B" }
  ];

  return (
    <section className="category-showcase">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse products by your favorite categories</p>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="category-card"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--category-color': category.color
              }}
            >
              <div className="category-icon">
                <span className="category-emoji">{category.icon}</span>
                <div className="icon-background"></div>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-items">{category.items}</p>
                <button className="category-btn">
                  Explore
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase; // ✅ Changed to default export