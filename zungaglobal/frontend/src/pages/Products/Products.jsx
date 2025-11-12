import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* -------------------------------------------------
   *  Load products & cart from localStorage
   * ------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // ---- products -------------------------------------------------
      let dbProducts = JSON.parse(localStorage.getItem('products') || '[]');
      if (dbProducts.length === 0) {
        const sampleProducts = [
          {
            id: '1',
            name: 'Nike Air Zoom Pegasus 40',
            price: 120,
            description: 'Running shoes with advanced cushioning technology.',
            category: 'Sports',
            brand: 'Nike',
            images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150/0000FF'],
            stock: 15,
          },
          {
            id: '2',
            name: 'Adidas Ultraboost 5.0',
            price: 180,
            description: 'Premium running shoes with Boost technology.',
            category: 'Sports',
            brand: 'Adidas',
            images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150/FF0000'],
            stock: 8,
          },
          {
            id: '3',
            name: 'Puma RS-X',
            price: 110,
            description: 'Trendy sneakers with retro design and modern comfort.',
            category: 'Casual',
            brand: 'Puma',
            images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150/00FF00'],
            stock: 20,
          },
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        dbProducts = sampleProducts;
      }
      setProducts(dbProducts);
      setFilteredProducts(dbProducts);

      // ---- cart ----------------------------------------------------
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);

      setLoading(false);
    };

    loadData();
  }, []);

  /* -------------------------------------------------
   *  Search handler
   * ------------------------------------------------- */
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  /* -------------------------------------------------
   *  UI
   * ------------------------------------------------- */
  if (loading) {
    return (
      <div className="products-page">
        <Header />
        <main className="products-main container">
          <p className="loading">Loading products…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="products-page">
      <Header />

      <main className="products-main container">
        {/* ---------- Search ---------- */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        {/* ---------- Product Grid ---------- */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p>No products match your search.</p>
          ) : (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
                // optional: pass the whole product via state (faster than re-reading LS)
                state={{ product }}
              >
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="product-image"
                />
                <p className="product-name">{product.name}</p>
                <p className="product-price">${product.price}</p>
              </Link>
            ))
          )}
        </div>

        {/* ---------- Cart Sidebar ---------- */}
        <div className="cart-sidebar">
          <h3>Cart ({cartItems.reduce((s, i) => s + (i.quantity || 1), 0)})</h3>
          {cartItems.length === 0 ? (
            <p>No items added</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div>
                  <p>{item.name}</p>
  <p>
                    ${item.price} × {item.quantity || 1}
                  </p>
                </div>
              </div>
            ))
          )}
          <button onClick={() => navigate('/cart')} className="btn btn-primary">
            Go to Cart
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;