import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          _id: '1',
          orderNumber: 'ORD-001',
          user: { name: 'John Doe', email: 'john@example.com' },
          total: 199.99,
          status: 'pending',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          createdAt: '2024-03-20',
          items: [{ product: { name: 'Wireless Headphones' }, quantity: 1, price: 199.99 }]
        },
        {
          _id: '2',
          orderNumber: 'ORD-002',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          total: 349.98,
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'paypal',
          createdAt: '2024-03-19',
          items: [
            { product: { name: 'Smart Watch' }, quantity: 1, price: 299.99 },
            { product: { name: 'Laptop Backpack' }, quantity: 1, price: 49.99 }
          ]
        },
        {
          _id: '3',
          orderNumber: 'ORD-003',
          user: { name: 'Mike Johnson', email: 'mike@example.com' },
          total: 49.99,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'momo',
          createdAt: '2024-03-18',
          items: [{ product: { name: 'Laptop Backpack' }, quantity: 1, price: 49.99 }]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="section-header">
        <h2>Order Management</h2>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>
                  <div className="order-number">{order.orderNumber}</div>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{order.user.name}</div>
                    <div className="customer-email">{order.user.email}</div>
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.total}</td>
                <td>
                  <div className="payment-info">
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="payment-method">{order.paymentMethod}</div>
                  </div>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">View</button>
                    <button className="btn-edit">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <p>No orders found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;