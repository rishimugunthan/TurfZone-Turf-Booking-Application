import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBookingAPI } from '../services/api';
import { TIME_SLOTS } from '../services/mockData';
import './BookingModal.css';

/**
 * BookingModal Component
 * Shown when a logged-in user clicks "Book Now" on a turf card.
 * Collects user name, email, date, time slot and submits to the backend.
 *
 * Props:
 *   turf    - selected turf object
 *   onClose - callback to close the modal
 */
function BookingModal({ turf, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pre-fill form with logged-in user's info
  const [form, setForm] = useState({
    userName:    user?.fullName || '',
    email:       user?.email    || '',
    bookingDate: '',
    bookingTime: '',
  });

  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [errors,   setErrors]   = useState({});

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.userName.trim())
      e.userName = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.bookingDate)
      e.bookingDate = 'Please select a date';
    if (!form.bookingTime)
      e.bookingTime = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handle field change ──────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Handle form submit ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        userName:    form.userName,
        email:       form.email,
        turfId:      turf.id,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
      };

      const res = await createBookingAPI(payload);
      setSuccess(
        `🎉 Booking confirmed for ${turf.turfName}! Booking ID: #${res.data.bookingId}. A confirmation email has been sent to ${form.email}.`
      );
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        // Demo mode — no backend
        setSuccess(
          `🎉 [Demo] Booking confirmed for ${turf.turfName}! When connected to the backend, a confirmation email would be sent to ${form.email}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Close on backdrop click ──────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            BOOK <span>SLOT</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {/* Selected turf info */}
          <div className="modal-turf-info">
            <div>
              <div className="modal-turf-name">{turf.turfName}</div>
              <div className="modal-turf-location">📍 {turf.location}</div>
            </div>
            <div className="modal-turf-price-wrap">
              <div className="modal-turf-price">₹{turf.pricePerHour.toLocaleString()}</div>
              <div className="modal-turf-price-sub">/hour</div>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <div className="success-msg">{success}</div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-msg">{error}</div>
          )}

          {/* Booking Form */}
          {!success && (
            <form onSubmit={handleSubmit} noValidate>

              {/* User Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  name="userName"
                  placeholder="Your full name"
                  value={form.userName}
                  onChange={handleChange}
                />
                {errors.userName && <div className="form-error">{errors.userName}</div>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              {/* Date + Time (two columns) */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    name="bookingDate"
                    min={today}
                    value={form.bookingDate}
                    onChange={handleChange}
                  />
                  {errors.bookingDate && <div className="form-error">{errors.bookingDate}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select
                    className="form-input"
                    name="bookingTime"
                    value={form.bookingTime}
                    onChange={handleChange}
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.bookingTime && <div className="form-error">{errors.bookingTime}</div>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="form-submit"
                disabled={loading}
              >
                {loading ? 'CONFIRMING...' : 'CONFIRM BOOKING'}
              </button>

            </form>
          )}

          {/* Close button after success */}
          {success && (
            <button className="form-submit" style={{ marginTop: '0.5rem' }} onClick={onClose}>
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
