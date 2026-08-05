import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { updateProduct } from '../../services/adminService';
import { fetchProductById, fetchCategories } from '../../services/productService';
import { ToastContext } from '../../context/ToastContext';
import { Save } from 'lucide-react';

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: 'Electronics',
    brand: 'ShopEZ',
    imageUrl: '',
    stock: '15',
    isFeatured: false,
    isDeal: false,
    isBestSeller: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res)).catch(() => {});

    fetchProductById(id)
      .then((p) => {
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price !== undefined ? p.price : '',
          discount: p.discount !== undefined ? p.discount : 0,
          category: p.category || 'Electronics',
          brand: p.brand || 'ShopEZ',
          imageUrl: p.images && p.images[0] ? p.images[0] : '',
          stock: p.stock !== undefined ? p.stock : 10,
          isFeatured: p.isFeatured || false,
          isDeal: p.isDeal || false,
          isBestSeller: p.isBestSeller || false,
        });
      })
      .catch((err) => addToast('Failed fetching product details', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: [formData.imageUrl],
      });

      addToast(`Product updated successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast(err.message || 'Failed updating product', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit Product: ${formData.name}`}>
      <div className="glass-card" style={{ maxWidth: '800px', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Full Product Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span>Featured Product</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isDeal}
                onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
              />
              <span>Today's Deal</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              />
              <span>Best Seller</span>
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem', marginTop: '1rem' }} disabled={loading}>
            <Save size={18} /> Update Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
