import React, { useEffect, useState, useContext } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { handleImageError } from '../../utils/formatCurrency';
import { fetchCategories } from '../../services/productService';
import { createCategory, deleteCategory } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const { addToast } = useContext(ToastContext);

  const loadCategories = () => {
    setLoading(true);
    fetchCategories()
      .then((data) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name || !image) return;

    try {
      await createCategory({ name, image, description });
      addToast(`Category "${name}" created successfully!`, 'success');
      setName('');
      setImage('');
      setDescription('');
      loadCategories();
    } catch (err) {
      addToast(err.message || 'Failed creating category', 'error');
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        await deleteCategory(id);
        addToast(`Category "${catName}" deleted.`, 'info');
        loadCategories();
      } catch (err) {
        addToast(err.message || 'Failed deleting category', 'error');
      }
    }
  };

  return (
    <AdminLayout title="Manage Categories">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Create Form */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Add New Category</h3>
          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                placeholder="e.g. Wearable Tech"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Short department overview..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <Plus size={16} /> Create Category
            </button>
          </form>
        </div>

        {/* List Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>Loading categories...</td>
                </tr>
              ) : categories.map((c) => (
                <tr key={c._id || c.name}>
                  <td>
                    <img src={c.image} alt={c.name} onError={handleImageError} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>{c.name}</strong>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || '-'}</td>
                  <td>
                    <button onClick={() => handleDeleteCategory(c._id, c.name)} className="btn-danger" style={{ padding: '0.35rem 0.6rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
