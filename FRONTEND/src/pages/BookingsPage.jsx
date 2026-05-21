import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookingsAPI } from '../services/api';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import StarRating from '../components/StarRating';
import './BookingsPage.css';

/**
 * BookingsPage — Shows all bookings for the currently logged-in user.
 * This is a protected route (see ProtectedRoute.js).
 *
 * Fetches GET /api/bookings/my which is secured by JWT.
 */
function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookingsAPI();
        setBookings(res.data);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          // Demo mode — show empty state
          setBookings([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className="bookings-page">
        {/* Page Header */}
        <div className="bookings-header">
          <div>
            <h1 className="bookings-title">MY <span>BOOKINGS</span></h1>
            <p className="bookings-sub">
              Showing all bookings for <strong>{user?.email}</strong>
            </p>
          </div>
          <Link to="/" className="back-btn">← Browse Turfs</Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        )}

        {/* Error */}
        {error && <div className="error-msg">{error}</div>}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No bookings yet</h3>
            <p>
              You haven't booked any turf yet.{' '}
              <Link to="/" style={{ color: 'var(--red)' }}>Browse turfs →</Link>
            </p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length > 0 && (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-id">Booking #{booking.bookingId}</div>
                  <div className="booking-status">✅ Confirmed</div>
                </div>

                <div className="booking-turf-name">
                  {booking.turf?.turfName}
                </div>

                <div className="booking-turf-location">
                  📍 {booking.turf?.location}
                </div>

                <div className="booking-rating">
                  <StarRating rating={booking.turf?.rating || 0} size="sm" />
                  <span>{booking.turf?.rating}</span>
                </div>

                <div className="booking-details">
                  <div className="booking-detail">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{booking.bookingDate}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{booking.bookingTime}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">Price</span>
                    <span className="detail-value" style={{ color: 'var(--red)' }}>
                      ₹{booking.turf?.pricePerHour?.toLocaleString()}/hr
                    </span>
                  </div>
                </div>

                <div className="booking-email">
                  📧 Confirmation sent to {booking.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default BookingsPage;
