// src/api.js
import axios from 'axios';

const backEndConnect = axios.create({
  baseURL: 'http://localhost:8000', // or whatever port your backend is running on
  withCredentials: true,
});

export default backEndConnect;
