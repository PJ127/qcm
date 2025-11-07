// API configuration
// Use environment variable if available, otherwise use relative path for proxy
// In development, Vite proxy will redirect /api to http://localhost:8000
// In production, adjust this based on your deployment setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export { API_BASE_URL };
