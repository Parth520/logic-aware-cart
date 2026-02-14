// services/api.js — centralized API communication layer

const API_BASE_URL = '/products';

/**
 * Fetches the full product catalog from the backend.
 * @returns {Promise<Array>} Array of product objects
 */
export async function fetchProducts() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

/**
 * Fetches a single product by ID.
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Single product object
 */
export async function fetchProductById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch product ${id}: ${response.status}`);
    }
    return response.json();
}