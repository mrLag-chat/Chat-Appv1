import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

let socket = null;

export const initializeSocket = (userId) => {
    if (socket) {
        console.log("✅ Socket already exists, reusing");
        return socket;
    }

    console.log("🔌 Creating new socket connection");
    socket = io("http://localhost:5000", {
        // query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        toast.success(" Socket connected:")
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        toast.error("Socket disconnected: " + reason);
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error.message);
        toast.error("Socket connection error: " + error.message);
    });

    return socket;
};
initializeSocket();
export const getSocket = () => {
    if (!socket) {
        console.warn("⚠️ Socket not initialized. Call initializeSocket first.");
        toast.error("Socket not initialized. Call initializeSocket first.");
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("💀 Disconnecting socket");
        socket.disconnect();
        socket = null;
    }
};