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
    if (!user) {
      setSocket(null);
      return;
    }

    const socketUrl =
      (import.meta.env.VITE_SOCKET_URL as string) || "http://localhost:5000";

    // withCredentials sends the httpOnly JWT cookie automatically in the handshake
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Cleanup: close socket when user logs out or component unmounts
    return () => {
      newSocket.close();
    };
  // socket intentionally excluded — including it would cause an infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
