import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

// Components
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import OrderManagement from './components/OrderManagement';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: ' Dashboard', icon: '📊' },
    { id: 'products', label: ' Products', icon: '🛍️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'orders', label: ' Orders', icon: '🧾' },
    { id: 'categories', label: ' Categories', icon: '🗂️' },
    { id: 'analytics', label: ' Analytics', icon: '📈' },
    { id: 'reviews', label: ' Reviews', icon: '⭐' },
    { id: 'settings', label: ' Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />;
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'categories':
        return <div>Categories Management - Coming Soon</div>;
      case 'analytics':
        return <div>Analytics - Coming Soon</div>;
      case 'reviews':
        return <div>Reviews Management - Coming Soon</div>;
      case 'settings':
        return <div>Settings - Coming Soon</div>;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>ZungaGlobal</h2>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role}</div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">🔔</button>
              <button className="theme-toggle">🌙</button>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;