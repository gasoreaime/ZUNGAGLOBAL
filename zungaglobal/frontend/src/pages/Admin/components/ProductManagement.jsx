import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    sku: '',
    isPublished: false,
    isFeatured: false,
    images: []
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      let productsData = [];

      // Try to fetch from API first
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            productsData = data.data.products || [];
          }
        }
      } catch {
        console.log('API fetch failed, using localStorage');
      }

      // Fallback to localStorage
      if (productsData.length === 0) {
        productsData = JSON.parse(localStorage.getItem('products') || '[]');
      }

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Ultimate fallback
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = () => {
    try {
      const localCategories = JSON.parse(localStorage.getItem('categories') || '[]');
      if (localCategories.length === 0) {
        // Default categories
        const defaultCategories = [
          { _id: '1', name: 'Electronics' },
          { _id: '2', name: 'Fashion' },
          { _id: '3', name: 'Home & Garden' },
          { _id: '4', name: 'Sports' }
        ];
        setCategories(defaultCategories);
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
      } else {
        setCategories(localCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      const defaultCategories = [
        { _id: '1', name: 'Electronics' },
        { _id: '2', name: 'Fashion' },
        { _id: '3', name: 'Home & Garden' },
        { _id: '4', name: 'Sports' }
      ];
      setCategories(defaultCategories);
    }
  };

  const handleImageUpload = (e) => {
    try {
      const files = Array.from(e.target.files);

      // Create preview URLs
      const imageUrls = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
        isPrimary: false
      }));

      // Set first image as primary
      if (imageUrls.length > 0) {
        imageUrls[0].isPrimary = true;
      }

      setFormData(prev => ({
        ...prev,
        images: imageUrls
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const setPrimaryImage = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    // If we removed the primary image, set a new primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) return 'Valid price is required';
    if (!formData.quantity || isNaN(parseInt(formData.quantity)) || parseInt(formData.quantity) < 0) return 'Valid quantity is required';
    if (!formData.sku.trim()) return 'SKU is required';
    if (!formData.category) return 'Category is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      return;
    }

    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: formData.images.map(img => ({
          url: img.url, // In real app, this would be uploaded to cloud storage
          alt: img.name,
          isPrimary: img.isPrimary
        }))
      };

      let updatedProducts;

      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map(p =>
          p._id === editingProduct._id
            ? { ...p, ...productData }
            : p
        );
      } else {
        // Add new product
        const newProduct = {
          _id: Date.now().toString(),
          ...productData,
          salesCount: 0,
          averageRating: 0,
          reviewCount: 0,
          viewCount: 0,
          createdAt: new Date().toISOString()
        };
        updatedProducts = [...products, newProduct];
      }

      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Try to save to API
      const saveToAPI = async () => {
        try {
          const token = localStorage.getItem('token');
          const method = editingProduct ? 'PUT' : 'POST';
          const url = editingProduct
            ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
            : 'http://localhost:5000/api/admin/products';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
          });

          if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }

          return await response.json();
        } catch {
          console.log('API save failed, using localStorage only');
          return null;
        }
      };

      await saveToAPI();
      setProducts(updatedProducts);
      resetForm();
      setShowForm(false);
    } catch {
      console.error('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      quantity: product.quantity.toString(),
      sku: product.sku,
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      images: product.images || []
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleting(productId);

      try {
        const updatedProducts = products.filter(p => p._id !== productId);

        // Update localStorage
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        // Try to delete from API
        const deleteFromAPI = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (!response.ok) {
              throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
          } catch {
            console.log('API delete failed, using localStorage only');
            return null;
          }
        };

        await deleteFromAPI();
        setProducts(updatedProducts);
    } catch {
      console.error('Error deleting product');
    } finally {
        setDeleting(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      sku: '',
      isPublished: false,
      isFeatured: false,
      images: []
    });
    setEditingProduct(null);
  };

  const togglePublish = async (productId) => {
    try {
      const updatedProducts = products.map(p =>
        p._id === productId ? { ...p, isPublished: !p.isPublished } : p
      );

      // Update localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Try to update API
      const updateAPI = async () => {
        try {
          const token = localStorage.getItem('token');
          const product = products.find(p => p._id === productId);
          const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isPublished: !product.isPublished })
          });

          if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }

          return await response.json();
        } catch {
          console.log('API update failed, using localStorage only');
          return null;
        }
      };

      await updateAPI();
      setProducts(updatedProducts);
    } catch {
      console.error('Error updating product');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add New Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label>Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />

                {formData.images.length > 0 && (
                  <div className="image-previews">
                    <h4>Image Previews:</h4>
                    <div className="preview-grid">
                      {formData.images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={image.url} alt={image.name} />
                          <div className="image-actions">
                            <button
                              type="button"
                              className={`btn-small ${image.isPrimary ? 'primary' : 'secondary'}`}
                              onClick={() => setPrimaryImage(index)}
                            >
                              {image.isPrimary ? 'Primary' : 'Set Primary'}
                            </button>
                            <button
                              type="button"
                              className="btn-small danger"
                              onClick={() => removeImage(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  />
                  <label>Published</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  />
                  <label>Featured</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Sales</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-info">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                            alt={product.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="image-placeholder">
                          {product.images && product.images.length > 0 ? '' : '🛍️'}
                        </div>
                      </div>
                      <div>
                        <div className="product-name">{product.name}</div>
                        {product.isFeatured && <span className="featured-badge">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <span className={`stock ${product.quantity <= 5 ? 'low' : 'good'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${product.isPublished ? 'published' : 'draft'}`}
                      onClick={() => togglePublish(product._id)}
                    >
                      {product.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>{product.salesCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                      >
                        {deleting === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <p>No products found. Create your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
