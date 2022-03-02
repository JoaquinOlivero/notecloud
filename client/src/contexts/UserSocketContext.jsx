import React from 'react'

// Socket.io
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACKEND_API;

export const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext();