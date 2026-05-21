import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllTurfsAPI } from '../services/api';
import { MOCK_TURFS } from '../services/mockData';

import Navbar          from '../components/Navbar';
import HeroSection     from '../components/HeroSection';
import SearchFilterBar from '../components/SearchFilterBar';
import TurfCard        from '../components/TurfCard';
import BookingModal    from '../components/BookingModal';
import Footer          from '../components/Footer';

import './HomePage.css';

/**
 * HomePage — Main landing page.
 *
 * Responsibilities:
 * - Fetch turfs from backend (fallback to mock data)
 * - Manage search, filter, sort state
 * - Apply client-side filtering and sorting
 * - Open booking modal on "Book Now" click
 * - Guard booking: redirect to login if not authenticated
 */
function HomePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // ── Data state ────────────────────────────────────────────────
  const [turfs,   setTurfs]   = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Filter / search state ─────────────────────────────────────
  const [search,        setSearch]        = useState('');
  const [filterSport,   setFilterSport]   = useState('');
  const [filterRating,  setFilterRating]  = useState('');
  const [minPrice,      setMinPrice]      = useState('');
  const [maxPrice,      setMaxPrice]      = useState('');
  const [sortBy,        setSortBy]        = useState('');

  // ── Modal state ───────────────────────────────────────────────
  const [bookingTurf, setBookingTurf] = useState(null); // null = closed

  // ── Fetch turfs on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await getAllTurfsAPI();
        setTurfs(res.data);
      } catch {
        // Backend not running — use mock data
        setTurfs(MOCK_TURFS);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  // ── Handle "Book Now" click ───────────────────────────────────
  const handleBookClick = (turf) => {
    if (!isLoggedIn) {
      // Redirect to login, preserving destination
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setBookingTurf(turf);
  };

  // ── Client-side filter + sort ─────────────────────────────────
  let displayed = [...turfs];

  // 1. Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    displayed = displayed.filter(
      (t) =>
        t.turfName.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  }

  // 2. Sport filter
  if (filterSport) {
    displayed = displayed.filter((t) =>
      t.sportsAvailable.toLowerCase().includes(filterSport.toLowerCase())
    );
  }

  // 3. Rating filter
  if (filterRating) {
    displayed = displayed.filter((t) => t.rating >= parseFloat(filterRating));
  }

  // 4. Price range filter
  if (minPrice) displayed = displayed.filter((t) => t.pricePerHour >= parseInt(minPrice));
  if (maxPrice) displayed = displayed.filter((t) => t.pricePerHour <= parseInt(maxPrice));

  // 5. Sort
  if (sortBy === 'price_asc')  displayed.sort((a, b) => a.pricePerHour - b.pricePerHour);
  if (sortBy === 'price_desc') displayed.sort((a, b) => b.pricePerHour - a.pricePerHour);
  if (sortBy === 'rating')     displayed.sort((a, b) => b.rating - a.rating);

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <HeroSection />

      <SearchFilterBar
        search={search}             setSearch={setSearch}
        filterSport={filterSport}   setFilterSport={setFilterSport}
        filterRating={filterRating} setFilterRating={setFilterRating}
        minPrice={minPrice}         setMinPrice={setMinPrice}
        maxPrice={maxPrice}         setMaxPrice={setMaxPrice}
        sortBy={sortBy}             setSortBy={setSortBy}
      />

      {/* Turfs Section */}
      <section className="turfs-section" id="turfs-section">
        <div className="section-header">
          <h2 className="section-title">AVAILABLE TURFS</h2>
          <span className="turf-count">
            {displayed.length} turf{displayed.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        )}

        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3 className="empty-title">No turfs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Turf cards grid */}
        {!loading && displayed.length > 0 && (
          <div className="turfs-grid">
            {displayed.map((turf) => (
              <TurfCard key={turf.id} turf={turf} onBook={handleBookClick} />
            ))}
          </div>
        )}
      </section>

      <Footer />

      {/* Booking modal (renders only when a turf is selected) */}
      {bookingTurf && (
        <BookingModal
          turf={bookingTurf}
          onClose={() => setBookingTurf(null)}
        />
      )}
    </>
  );
}

export default HomePage;
