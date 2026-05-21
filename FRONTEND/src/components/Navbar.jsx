import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar Component
 *
 * Shows:
 * - Logo (links to home)
 * - Navigation links
 * - Login + Signup buttons (when NOT logged in)
 * - Username + My Bookings + Logout (when logged in)
 */
function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToTurfs = () => {
    const section = document.getElementById('turfs-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        TURF<span>ZONE</span>
      </Link>

      {/* Nav Links */}
      <div className="navbar-links">
        <span className="nav-link" onClick={scrollToTurfs}>
          Turfs
        </span>

        {isLoggedIn ? (
          /* Logged-in state */
          <div className="nav-user">
            <span className="nav-username">
              Hey, <strong>{user?.fullName?.split(' ')[0]}</strong>
            </span>
            <Link to="/my-bookings" className="nav-btn btn-outline">
              My Bookings
            </Link>
            <button className="nav-btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          /* Logged-out state */
          <div className="nav-auth">
            <Link to="/login" className="nav-btn btn-outline">
              Login
            </Link>
            <Link to="/signup" className="nav-btn btn-red">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
