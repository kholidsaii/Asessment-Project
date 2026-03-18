// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token hasil login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Masukkan ke header
  }
  return config;
});

export default api;