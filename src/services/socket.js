import { io } from 'socket.io-client';

// Extract base URL from API_URL by removing /api
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const socket = io(API_BASE_URL);

export default socket;
