import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppData } from "./AppContext";
import { SocketContext } from "./SocketContext";
import { realtimeService } from "../main";
export const SocketProvider = ({ children }) => {
  const { isAuth } = useAppData();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!isAuth) {
      return;
    }
    const socket = io(realtimeService, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("Socket Connected", socket.id);
      setSocket(socket);
    });
    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setSocket((currentSocket) =>
        currentSocket === socket ? null : currentSocket,
      );
    });
    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });
    return () => {
      socket.disconnect();
    };
  }, [isAuth]);
  return (
    <SocketContext.Provider
      value={{
        socket: isAuth ? socket : null,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
