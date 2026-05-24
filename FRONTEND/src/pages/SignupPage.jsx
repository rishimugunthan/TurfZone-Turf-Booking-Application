import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupAPI } from '../services/api';
import './AuthPage.css';

function SignupPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    fullName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'Full name must be at least 2 characters';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Please enter a valid email';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        fullName: form.fullName,
        email:    form.email,
        password: form.password,
      };
      const res = await signupAPI(payload);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This email is already registered. Please login instead.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        login('demo-jwt-token', {
          id: Date.now(),
          fullName: form.fullName,
          email: form.email,
        });
        navigate('/');
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
        <p className="auth-subtitle">Join thousands of sports enthusiasts</p>

        <hr className="auth-divider" />

        <h1 className="auth-title">CREATE ACCOUNT</h1>
        <p className="auth-desc">Fill in the details below to register.</p>

        {/* Error banner */}
        {error && <div className="error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="fullName"
              placeholder="Your full name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

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
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in →</Link>
        </p>

        <p className="auth-switch" style={{ marginTop: '8px' }}>
          <Link to="/">← Back to turfs</Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;
