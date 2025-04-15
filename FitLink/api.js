/**
 * Base URL for API calls, changes based on environment
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Helper function to create full API endpoint URLs
 * @param {string} endpoint - The API endpoint path
 * @returns {string} The full API URL
 */
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;