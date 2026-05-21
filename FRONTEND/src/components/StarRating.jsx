import React from 'react';
import './StarRating.css';

/**
 * StarRating Component
 * Renders 5 stars with filled/half/empty states based on rating value.
 *
 * Props:
 *   rating  - number (e.g. 4.5)
 *   size    - 'sm' | 'md' (default: 'md')
 */
function StarRating({ rating, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    if (i <= Math.floor(rating)) return 'full';
    if (i === Math.ceil(rating) && rating % 1 >= 0.5) return 'half';
    return 'empty';
  });

  return (
    <div className={`stars stars--${size}`}>
      {stars.map((type, idx) => (
        <span
          key={idx}
          className={`star star--${type}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
