// src/api/config.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // This is important for CORS requests
});

// Add request interceptor
api.interceptors.request.use(function (config) {
  console.log('Making request to:', config.url);
  return config;
}, function (error) {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor
api.interceptors.response.use(function (response) {
  console.log('Received response from:', response.config.url);
  return response;
}, function (error) {
  console.error('Response error:', error.response ? error.response.data : error.message);
  return Promise.reject(error);
});

export default api;
