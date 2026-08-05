import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { loginUser } from '../../services/authService';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data);
      addToast(`Welcome back, ${data.name}!`, 'success');
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@shopez.com');
      setPassword('admin123');
    } else {
      setEmail('customer@shopez.com');
      setPassword('customer123');
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ padding: '4rem 0 6rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sign In to ShopEZ</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter your details to access your account</p>
          </div>

          {/* Demo Login Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('customer')}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.78rem' }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.78rem', borderColor: 'var(--primary-500)' }}
            >
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
                <Key size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
