// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // or whatever port your backend is running on
  withCredentials: true,
});

export default api;
