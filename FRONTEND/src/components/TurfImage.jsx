import React from 'react';
import './TurfImage.css';

/**
 * TurfImage Component
 * Shows the turf image if imageUrl exists.
 * Falls back to a styled placeholder with sport emojis if no image.
 *
 * Props:
 *   turf - turf object (needs imageUrl, sportsAvailable, location)
 */

// Background colors per primary sport
const SPORT_COLORS = {
  Cricket:    '#1a4a2e',
  Football:   '#0d3b6e',
  Badminton:  '#4a1a2e',
  Basketball: '#4a2e0d',
  Tennis:     '#2e4a0d',
  Volleyball: '#0d3b4a',
};

// Emojis per sport
const SPORT_ICONS = {
  Cricket:    '🏏',
  Football:   '⚽',
  Badminton:  '🏸',
  Basketball: '🏀',
  Tennis:     '🎾',
  Volleyball: '🏐',
};

function TurfImage({ turf }) {
  // If a real image URL is provided, show it
  if (turf.imageUrl) {
    return (
      <img
        src={turf.imageUrl}
        alt={turf.turfName}
        className="turf-img"
      />
    );
  }

  // Otherwise render a sport-themed placeholder
  const sports  = turf.sportsAvailable.split(',').map((s) => s.trim());
  const primary = sports[0];
  const bgColor = SPORT_COLORS[primary] || '#1a1a1a';

  return (
    <div
      className="turf-img-placeholder"
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, #0a0a0a 100%)`,
      }}
    >
      {/* Sport icons */}
      <div className="placeholder-icons">
        {sports.slice(0, 3).map((s) => (
          <span key={s} className="placeholder-icon">
            {SPORT_ICONS[s] || '🏆'}
          </span>
        ))}
      </div>

      {/* Location badge */}
      <div className="placeholder-location">
        📍 {turf.location}
      </div>
    </div>
  );
}

export default TurfImage;
