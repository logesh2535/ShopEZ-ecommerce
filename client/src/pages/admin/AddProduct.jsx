import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { createProduct } from '../../services/adminService';
import { fetchCategories } from '../../services/productService';
import { ToastContext } from '../../context/ToastContext';
import { PlusCircle, Save } from 'lucide-react';

export const AddProduct = () => {
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      });

      addToast(`Product "${formData.name}" added successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast(err.message || 'Failed adding product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Product to Catalog">
      <div className="glass-card" style={{ maxWidth: '800px', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="e.g. Wireless ANC Headphones"
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
                {categories.length > 0 ? (
                  categories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)
                ) : (
                  <>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty & Care">Beauty & Care</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                  </>
                )}
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
                placeholder="199.99"
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
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Full Product Description</label>
            <textarea
              rows={4}
              placeholder="Enter detailed features, materials, and benefits..."
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
            <Save size={18} /> {loading ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
