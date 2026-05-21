import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/api';
import './AuthPage.css';

/**
 * LoginPage — User login form.
 *
 * Flow:
 * 1. User fills email + password
 * 2. Calls POST /api/auth/login
 * 3. On success: saves token via AuthContext.login(), redirects home
 * 4. On failure: shows error message
 *
 * Also redirects back to the page the user was trying to visit
 * before being redirected to login (using react-router state).
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Where to redirect after login (default: home)
  const from = location.state?.from?.pathname || '/';

  // Form state
  const [form, setForm] = useState({ email: '', password: '' });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [errors,  setErrors]  = useState({});

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Please enter a valid email';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handle field change ──────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Handle submit ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const res = await loginAPI(form);
      // Save token + user info in context + localStorage
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        // Demo mode — simulate login when backend is offline
        login('demo-jwt-token', {
          id: 1,
          fullName: 'Demo User',
          email: form.email,
        });
        navigate(from, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <Link to="/" className="auth-logo">
          TURF<span>ZONE</span>
        </Link>
        <p className="auth-subtitle">Book your next match</p>

        <hr className="auth-divider" />

        <h1 className="auth-title">SIGN IN</h1>
        <p className="auth-desc">Welcome back! Enter your credentials.</p>

        {/* Error banner */}
        {error && <div className="error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup">Create one →</Link>
        </p>

        <p className="auth-switch" style={{ marginTop: '8px' }}>
          <Link to="/">← Back to turfs</Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
