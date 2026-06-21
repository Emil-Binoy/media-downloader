import { io } from 'socket.io-client';

const rawUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';
const API_BASE_URL = rawUrl.replace(/\/api$/, '');

const socket = io(API_BASE_URL);

export default socket;
