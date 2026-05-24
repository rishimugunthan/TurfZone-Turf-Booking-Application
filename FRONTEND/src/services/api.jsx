import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});
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
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('turfzone_token');
      localStorage.removeItem('turfzone_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signupAPI = (data) =>
  API.post('/api/auth/signup', data);

export const loginAPI = (data) =>
  API.post('/api/auth/login', data);

export const getMeAPI = () =>
  API.get('/api/auth/me');

export const getAllTurfsAPI = () =>
  API.get('/api/turfs');

export const getTurfByIdAPI = (id) =>
  API.get(`/api/turfs/${id}`);

export const searchTurfsAPI = (query) =>
  API.get('/api/turfs/search', { params: { q: query } });

export const filterBySportAPI = (sport) =>
  API.get('/api/turfs/filter/sport', { params: { sport } });

export const filterByRatingAPI = (minRating) =>
  API.get('/api/turfs/filter/rating', { params: { min: minRating } });

export const filterByPriceAPI = (minPrice, maxPrice) =>
  API.get('/api/turfs/filter/price', { params: { min: minPrice, max: maxPrice } });

export const createBookingAPI = (data) =>
  API.post('/api/bookings', data);

export const getMyBookingsAPI = () =>
  API.get('/api/bookings/my');

export const getAllBookingsAPI = () =>
  API.get('/api/bookings');

export default API;
