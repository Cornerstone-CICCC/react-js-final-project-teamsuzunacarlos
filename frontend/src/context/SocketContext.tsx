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
    // Get token from cookie
    const getToken = () => {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "token") return decodeURIComponent(value);
      }
      return null;
    };

    if (user) {
      const socketUrl =
        (import.meta.env.VITE_SOCKET_URL as string) || "http://localhost:5000";
      const token = getToken();

      const newSocket = io(socketUrl, {
        auth: {
          token: token || "",
        },
        withCredentials: true,
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
