import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Add a response interceptor to extract server error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    // Update the error message so components see the descriptive one
    error.message = message;
    return Promise.reject(error);
  }
);

export default api;
