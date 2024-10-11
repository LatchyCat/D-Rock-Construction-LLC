// src/api/services.js

import api from './config';

export const getHomeData = () => api.get('/');  // Updated to use the root endpoint
export const getReviews = () => api.get('/reviews');
export const createJobRequest = (data) => api.post('/job-requests', data);

// Auth services
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const checkAuth = () => api.get('/auth/check');

// JobRequest services
export const getJobRequests = () => api.get('/job-requests');
export const getJobRequestById = (id) => api.get(`/job-requests/${id}`);
export const updateJobRequest = (id, data) => api.put(`/job-requests/${id}`, data);
export const deleteJobRequest = (id) => api.delete(`/job-requests/${id}`);

// User services
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Add more API calls as needed
