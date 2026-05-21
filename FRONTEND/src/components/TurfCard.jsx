import React from 'react';
import StarRating from './StarRating';
import TurfImage from './TurfImage';
import './TurfCard.css';

/**
 * TurfCard Component
 * Displays one turf's details: image, name, sports, rating, price, book button.
 *
 * Props:
 *   turf    - turf data object from API/mock
 *   onBook  - callback(turf) when "Book Now" is clicked
 */
function TurfCard({ turf, onBook }) {
  // Parse sports string "Cricket,Football,Badminton" into array
  const sports = turf.sportsAvailable
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="turf-card" onClick={() => onBook(turf)}>
      {/* Turf image / placeholder */}
      <TurfImage turf={turf} />

      <div className="turf-body">
        {/* Name + Price */}
        <div className="turf-top">
          <div className="turf-name">{turf.turfName}</div>
          <div className="turf-price-wrap">
            <div className="turf-price">₹{turf.pricePerHour.toLocaleString()}</div>
            <div className="turf-price-sub">/ hour</div>
          </div>
        </div>

        {/* Rating */}
        <div className="turf-rating">
          <StarRating rating={turf.rating} />
          <span className="rating-num">{turf.rating}</span>
        </div>

        {/* Sports tags */}
        <div className="sports-list">
          {sports.map((sport) => (
            <span key={sport} className="sport-tag">{sport}</span>
          ))}
        </div>

        {/* Book button */}
        <button
          className="book-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click double-firing
            onBook(turf);
          }}
        >
          BOOK NOW →
        </button>
      </div>
    </div>
  );
}

export default TurfCard;
