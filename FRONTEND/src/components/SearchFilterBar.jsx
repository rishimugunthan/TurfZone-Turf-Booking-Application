import React from 'react';
import { ALL_SPORTS } from '../services/mockData';
import './SearchFilterBar.css';

/**
 * SearchFilterBar Component
 *
 * Props:
 *   search        - current search text
 *   setSearch     - setter for search text
 *   filterSport   - selected sport filter
 *   setFilterSport
 *   filterRating  - selected min rating
 *   setFilterRating
 *   minPrice      - min price filter
 *   setMinPrice
 *   maxPrice      - max price filter
 *   setMaxPrice
 *   sortBy        - current sort key
 *   setSortBy
 */
function SearchFilterBar({
  search, setSearch,
  filterSport, setFilterSport,
  filterRating, setFilterRating,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sortBy, setSortBy,
}) {
  return (
    <div className="controls-bar">

      {/* Search */}
      <div className="control-group search-group">
        <label className="control-label">Search</label>
        <input
          className="control-input"
          placeholder="Search turf or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter by Sport */}
      <div className="control-group">
        <label className="control-label">Sport</label>
        <select
          className="control-select"
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
        >
          <option value="">All Sports</option>
          {ALL_SPORTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Filter by Rating */}
      <div className="control-group">
        <label className="control-label">Min Rating</label>
        <select
          className="control-select"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+</option>
          <option value="4.0">4.0+</option>
          <option value="3.5">3.5+</option>
        </select>
      </div>

      {/* Filter by Price Range */}
      <div className="control-group">
        <label className="control-label">Price Range (₹/hr)</label>
        <div className="price-range">
          <input
            className="control-input price-input"
            placeholder="Min"
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="price-dash">—</span>
          <input
            className="control-input price-input"
            placeholder="Max"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="control-group">
        <label className="control-label">Sort By</label>
        <div className="sort-btn-group">
          <button
            className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'price_asc' ? '' : 'price_asc')}
          >
            ₹ Low
          </button>
          <button
            className={`sort-btn ${sortBy === 'price_desc' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'price_desc' ? '' : 'price_desc')}
          >
            ₹ High
          </button>
          <button
            className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'rating' ? '' : 'rating')}
          >
            ⭐ Top
          </button>
        </div>
      </div>

    </div>
  );
}

export default SearchFilterBar;
