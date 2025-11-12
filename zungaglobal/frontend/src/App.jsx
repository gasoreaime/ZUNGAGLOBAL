import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Admin from './pages/Admin/Admin';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails'; // <--- added
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home page as default route */}
          <Route path="/" element={<Home />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main application routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} /> {/* <--- added */}
          <Route path="/admin/*" element={<Admin />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
