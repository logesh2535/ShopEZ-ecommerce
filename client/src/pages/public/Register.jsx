import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { registerUser } from '../../services/authService';
import { UserPlus, User, Mail, Key, Phone } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match!', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name, email, phone, password });
      login(data);
      addToast('Account created successfully! Welcome to ShopEZ.', 'success');
      navigate('/customer/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ padding: '4rem 0 6rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Your Account</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Join ShopEZ for fast checkout & exclusive offers</p>
          </div>

          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

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
              <label>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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

            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
                <Key size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'} <UserPlus size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
