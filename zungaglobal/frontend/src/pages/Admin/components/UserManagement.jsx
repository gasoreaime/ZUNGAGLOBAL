import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true,
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      let usersData = [];

      // Try to fetch from API first
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            usersData = data.data.users || [];
            console.log('Users loaded from API:', usersData.length);
          }
        }
      } catch {
        console.log('API fetch failed, using localStorage only');
      }

      // Fallback to localStorage
      if (usersData.length === 0) {
        usersData = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Users loaded from localStorage:', usersData.length);
      }

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(localUsers);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.includes('@')) return 'Valid email is required';
    if (!editingUser && !formData.password) return 'Password is required for new users';
    if (formData.password && formData.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        isActive: formData.isActive,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      let updatedUsers;

      if (editingUser) {
        updatedUsers = users.map(u =>
          u._id === editingUser._id
            ? { ...u, ...userData, _id: editingUser._id }
            : u
        );
      } else {
        const newUser = {
          _id: `user-${Date.now()}`,
          ...userData
        };
        updatedUsers = [...users, newUser];
      }

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Try saving to API
      try {
        const token = localStorage.getItem('token');
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser
          ? `http://localhost:5000/api/admin/users/${editingUser._id}`
          : 'http://localhost:5000/api/admin/users';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        await response.json();
      } catch {
        console.log('API save failed, using localStorage only');
      }

      setUsers(updatedUsers);
      resetForm();
      setShowForm(false);

      alert(`User ${editingUser ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
      phone: user.phone || '',
      address: user.address || ''
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser._id === userId) {
      alert('You cannot delete your own account!');
      return;
    }

    setDeleting(userId);
    setError(null);

    try {
      const updatedUsers = users.filter(u => u._id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
      } catch {
        console.log('API delete failed, using localStorage only');
      }

      setUsers(updatedUsers);
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      if (!user) return;

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser._id === userId) {
        alert('You cannot deactivate your own account!');
        return;
      }

      const updatedUser = { ...user, isActive: !user.isActive };
      const updatedUsers = users.map(u =>
        u._id === userId ? updatedUser : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isActive: updatedUser.isActive })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        await response.json();
      } catch {
        console.log('API update failed, using localStorage only');
      }

      setUsers(updatedUsers);
      alert(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
      phone: '',
      address: ''
    });
    setEditingUser(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading users...
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="section-header">
        <div>
          <h2>User Management</h2>
          <p>Manage system users and their permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New User
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                    disabled={saving}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={editingUser ? "Enter new password" : "Enter password"}
                  required={!editingUser}
                  disabled={saving}
                  minLength="6"
                />
                <small>Minimum 6 characters</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                    disabled={saving}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="2"
                  placeholder="Enter address"
                  disabled={saving}
                />
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  disabled={saving}
                />
                <label>Active (user can login)</label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="mini-spinner"></div>
                      {editingUser ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingUser ? 'Update User' : 'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-header">
          <div className="table-info">
            <span>Total Users: {users.length}</span>
            <span>Active: {users.filter(u => u.isActive).length}</span>
            <span>Admins: {users.filter(u => u.role === 'admin').length}</span>
          </div>
          <button onClick={fetchUsers} className="btn-refresh">
            🔄 Refresh
          </button>
        </div>

        <div className="users-table">
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Users Found</h3>
              <p>Get started by creating your first user</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add Your First User
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || user.id || `user-${index}`}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <small>{user._id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <button
                        className={`status-btn ${user.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleUserStatus(user._id)}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(user)}
                          disabled={deleting === user._id}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                        >
                          {deleting === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
