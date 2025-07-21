import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get all items
export const getItems = () => axios.get(`${API_URL}/items`);

// Create an item
export const createItem = (item) => axios.post(`${API_URL}/items`, item);

// Update an item
export const updateItem = (id, item) => axios.put(`${API_URL}/items/${id}`, item);

// Delete an item
export const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`);
