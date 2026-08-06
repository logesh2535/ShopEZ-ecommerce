import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/formatCurrency';
import { fetchProducts } from '../../services/productService';
import { deleteProduct } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const { addToast } = useContext(ToastContext);

  const loadProducts = () => {
    setLoading(true);
    fetchProducts({ keyword })
      .then((data) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [keyword]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await deleteProduct(id);
        addToast(`Product "${name}" deleted.`, 'info');
        loadProducts();
      } catch (err) {
        addToast(err.message || 'Failed deleting product', 'error');
      }
    }
  };

  return (
    <AdminLayout title="Manage Store Inventory & Products">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <Link to="/admin/products/add" className="btn-primary">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.images[0]} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</span>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.discount}%</td>
                  <td>
                    <span className={`badge badge-${p.stock > 5 ? 'success' : 'danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/products/edit/${p._id}`} className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Edit">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="btn-danger" style={{ padding: '0.35rem 0.6rem' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
