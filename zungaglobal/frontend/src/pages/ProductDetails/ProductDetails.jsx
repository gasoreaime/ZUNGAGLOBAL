import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      setLoading(true);

      // Prefer passed state
      if (state?.product?.id?.toString() === id) {
        setProduct(state.product);
      }

      // Fallback: read from localStorage
      const all = JSON.parse(localStorage.getItem('products') || '[]');
      const found = all.find((p) => p.id?.toString() === id);
      if (found && !product) setProduct(found);

      // Related
      if (found) {
        const rel = all.filter((p) => p.id !== found.id && p.category === found.category);
        setRelated(rel);
      }

      // Cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);

      setLoading(false);
    };

    load();
  }, [id, state, product]);

  const addToCart = () => {
    if (!product || product.stock === 0) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIdx = cart.findIndex((i) => i.id === product.id);

    if (existingIdx > -1) {
      cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Header />
        <main className="product-details-main container">
          <p className="loading">Loading product details…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Header />
        <main className="product-details-main container">
          <h2>Product not found!</h2>
          <Link to="/products">Back to shop</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Header />

      <main className="product-details-main">
        <div className="container main-layout">
          <div className="product-info">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="product-main-image"
            />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> {product.price} $</p>
            <p>
              <strong>Stock:</strong>{' '}
              {product.stock > 0 ? `Available (${product.stock} left)` : 'Out of stock'}
            </p>

            <button
              onClick={addToCart}
              className="btn btn-primary"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="related-products">
            <h3>Related Products</h3>
            <div className="related-grid">
              {related.length > 0 ? (
                related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="related-card"
                    state={{ product: p }}
                  >
                    <img src={p.images?.[0]} alt={p.name} />
                    <p>{p.name}</p>
                    <p>{p.price} $</p>
                  </Link>
                ))
              ) : (
                <p>No related products</p>
              )}
            </div>
          </div>

          <div className="cart-sidebar">
            <h3>Cart ({cartItems.reduce((s, i) => s + (i.quantity || 1), 0)})</h3>
            {cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div>
                    <p>{item.name}</p>
                    <p>
                      {item.price} $ × {item.quantity || 1}
                    </p>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => navigate('/cart')} className="btn btn-primary">
              View Cart
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;