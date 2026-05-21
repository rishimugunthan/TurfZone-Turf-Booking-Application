import axios from 'axios';

/**
 * api.js — Central Axios configuration + all API service functions.
 *
 * HOW IT WORKS:
 * - Creates a base Axios instance pointing to Spring Boot backend
 * - Request interceptor: auto-attaches JWT token to every request
 * - Response interceptor: handles 401 (token expired → redirect to login)
 * - All API functions are exported for use in components
 */

// ── Base Axios Instance ──────────────────────────────────────
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ── Request Interceptor ──────────────────────────────────────
// Automatically adds "Authorization: Bearer <token>" to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('turfzone_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────
// Handles expired/invalid tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('turfzone_token');
      localStorage.removeItem('turfzone_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ════════════════════════════════════════════════════════════
// AUTH API CALLS
// ════════════════════════════════════════════════════════════

/**
 * Register a new user.
 * POST /api/auth/signup
 */
export const signupAPI = (data) =>
  API.post('/api/auth/signup', data);

/**
 * Login an existing user.
 * POST /api/auth/login
 */
export const loginAPI = (data) =>
  API.post('/api/auth/login', data);

/**
 * Get current logged-in user info.
 * GET /api/auth/me (requires JWT)
 */
export const getMeAPI = () =>
  API.get('/api/auth/me');

// ════════════════════════════════════════════════════════════
// TURF API CALLS
// ════════════════════════════════════════════════════════════

/**
 * Fetch all turfs.
 * GET /api/turfs
 */
export const getAllTurfsAPI = () =>
  API.get('/api/turfs');

/**
 * Fetch single turf by ID.
 * GET /api/turfs/:id
 */
export const getTurfByIdAPI = (id) =>
  API.get(`/api/turfs/${id}`);

/**
 * Search turfs by name or location.
 * GET /api/turfs/search?q=cricket
 */
export const searchTurfsAPI = (query) =>
  API.get('/api/turfs/search', { params: { q: query } });

/**
 * Filter turfs by sport.
 * GET /api/turfs/filter/sport?sport=Football
 */
export const filterBySportAPI = (sport) =>
  API.get('/api/turfs/filter/sport', { params: { sport } });

/**
 * Filter turfs by minimum rating.
 * GET /api/turfs/filter/rating?min=4.0
 */
export const filterByRatingAPI = (minRating) =>
  API.get('/api/turfs/filter/rating', { params: { min: minRating } });

/**
 * Filter turfs by price range.
 * GET /api/turfs/filter/price?min=500&max=1000
 */
export const filterByPriceAPI = (minPrice, maxPrice) =>
  API.get('/api/turfs/filter/price', { params: { min: minPrice, max: maxPrice } });

// ════════════════════════════════════════════════════════════
// BOOKING API CALLS
// ════════════════════════════════════════════════════════════

/**
 * Create a new booking. Requires authentication.
 * POST /api/bookings
 */
export const createBookingAPI = (data) =>
  API.post('/api/bookings', data);

/**
 * Get all bookings for the current user.
 * GET /api/bookings/my (requires JWT)
 */
export const getMyBookingsAPI = () =>
  API.get('/api/bookings/my');

/**
 * Get all bookings (admin).
 * GET /api/bookings (requires JWT)
 */
export const getAllBookingsAPI = () =>
  API.get('/api/bookings');

export default API;
