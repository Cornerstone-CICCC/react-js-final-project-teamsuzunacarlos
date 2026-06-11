// Socket.IO context
// Should provide:
// - Socket instance globally
// - Connection state
// - Listeners for real-time events
// - Methods to emit events

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // When user is logged in
    if (user) {
      const socketUrl =
        (import.meta.env.VITE_SOCKET_URL as string) || "http://localhost:5000";
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // When user logged out
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
