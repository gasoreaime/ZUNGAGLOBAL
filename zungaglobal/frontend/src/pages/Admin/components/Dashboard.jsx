import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      let statsData = null;

      const token = localStorage.getItem('token');
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok) {
        const responseData = await statsResponse.json();
        if (responseData.success) {
          statsData = responseData.data;
          console.log('✅ Data loaded from API');
        }
      }

      if (statsData) {
        setStats(statsData.overview);
        setRecentOrders(statsData.recentOrders || []);
        setTopProducts(statsData.topProducts || []);
      } else {
        console.warn('⚠️ API fetch failed — using local data');
        loadLocalData();
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');

      const totalUsers = users.length;
      const totalProducts = products.length;
      const totalOrders = orders.length;

      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt || order.date || order.orderDate || Date.now()).toDateString();
        return orderDate === today;
      }).length;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders.reduce((sum, order) => {
        const date = new Date(order.createdAt || order.date || order.orderDate || Date.now());
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
          ? sum + (order.total || order.amount || order.price || 0)
          : sum;
      }, 0);

      const lowStockProducts = products.filter(p => (p.quantity || p.stock || 0) <= 5).length;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newUsers = users.filter(user => {
        const date = new Date(user.createdAt || user.date || user.registeredAt || Date.now());
        return date >= thirtyDaysAgo;
      }).length;

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        todayOrders,
        monthlyRevenue,
        lowStockProducts,
        newUsers,
      });

      const sortedOrders = orders
        .map(order => ({ ...order, sortDate: new Date(order.createdAt || order.date || order.orderDate || Date.now()) }))
        .sort((a, b) => b.sortDate - a.sortDate)
        .slice(0, 5);

      setRecentOrders(sortedOrders);

      const sortedProducts = [...products]
        .sort((a, b) => (b.salesCount || b.popularity || 0) - (a.salesCount || a.popularity || 0))
        .slice(0, 5);

      setTopProducts(sortedProducts);
    } catch (err) {
      console.error('❌ Error loading local data:', err);
      setError('Failed to load local data');
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        todayOrders: 0,
        monthlyRevenue: 0,
        lowStockProducts: 0,
        newUsers: 0,
      });
      setRecentOrders([]);
      setTopProducts([]);
    }
  };

  const renderProductImage = (product) => {
    const placeholder = <div className="image-placeholder">🛍️</div>;
    try {
      const images = product.images;
      if (!images || images.length === 0) return placeholder;

      let imageUrl = '';
      if (Array.isArray(images)) {
        const main = images.find(img => img.isPrimary) || images[0];
        imageUrl = typeof main === 'string' ? main : main.url;
      } else if (typeof images === 'string') {
        imageUrl = images;
      }

      if (!imageUrl) return placeholder;

      return (
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
      );
    } catch {
      return placeholder;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="error">
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`, subtitle: 'This month', icon: '💰', color: 'green' },
    { title: 'Total Users', value: (stats?.totalUsers || 0).toLocaleString(), subtitle: 'Registered users', icon: '👥', color: 'blue' },
    { title: 'Total Products', value: (stats?.totalProducts || 0).toLocaleString(), subtitle: 'Active products', icon: '🛍️', color: 'purple' },
    { title: 'Total Orders', value: (stats?.totalOrders || 0).toLocaleString(), subtitle: 'All time orders', icon: '🧾', color: 'orange' },
    { title: "Today's Orders", value: (stats?.todayOrders || 0).toLocaleString(), subtitle: 'Orders today', icon: '📦', color: 'red' },
    { title: 'Low Stock', value: (stats?.lowStockProducts || 0).toLocaleString(), subtitle: 'Products need restock', icon: '⚠️', color: 'yellow' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to your admin dashboard</p>
        {error && <div className="warning-banner">⚠️ Using local data: {error}</div>}
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <small>{stat.subtitle}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        {/* Recent Orders */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Orders</h3>
            <button onClick={fetchDashboardData} className="btn-refresh">🔄 Refresh</button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="no-data">
              <p>No recent orders</p>
              <small>Orders will appear here when available</small>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order._id || i}>
                    <td>{order.orderNumber || `ORD-${i + 1}`}</td>
                    <td>{order.user?.name || order.customerName || 'Customer'}</td>
                    <td>{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</td>
                    <td>${order.total || order.amount || 0}</td>
                    <td><span className={`status-badge ${order.status || 'pending'}`}>{order.status || 'pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Top Products */}
        <section className="dashboard-section">
          <h3>Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <div className="no-data">
              <p>No product data</p>
              <small>Add products to see them here</small>
            </div>
          ) : (
            <div className="products-grid">
              {topProducts.map((product, i) => (
                <div key={product._id || i} className="product-card">
                  {renderProductImage(product)}
                  <div className="product-info">
                    <h4>{product.name || 'Unnamed Product'}</h4>
                    <p className="product-price">${product.price || 0}</p>
                    <div className="product-meta">
                      <small>Sold: {product.salesCount || 0}</small>
                      <small>Stock: {product.quantity || product.stock || 0}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
