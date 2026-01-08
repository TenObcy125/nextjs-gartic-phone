import { io } from 'socket.io-client';
 
let socket;
 
export const connectSocket = () => {
  // Replace with your backend server URL
  // ip (szkoła ws://172.16.38.225:5000)
  socket = io('ws://localhost:5000', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
  });
 
  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });
 
  socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
  });
 
  return socket;
};
 
export const getSocket = () => {
  if (!socket) {
    console.log('Socket not initialized, connecting...');
    return connectSocket();
  }
  return socket;
};
 
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Disconnected from server');
  }
};