import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/AppProvider.jsx";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketProvider.jsx";
export const authService =
  import.meta.env.VITE_AUTH_SERVICE_URL ||
  "https://zestora-auth-api.onrender.com";
export const restaurantService =
  import.meta.env.VITE_RESTAURANT_SERVICE_URL ||
  "https://zestora-restaurant-api.onrender.com";
export const utilsService =
  import.meta.env.VITE_UTILS_SERVICE_URL ||
  "https://zestora-utils-api.onrender.com";
export const realtimeService =
  import.meta.env.VITE_REALTIME_SERVICE_URL ||
  "https://zestora-realtime-api.onrender.com";
export const riderService =
  import.meta.env.VITE_RIDER_SERVICE_URL ||
  "https://zestora-rider-api.onrender.com";
export const adminService =
  import.meta.env.VITE_ADMIN_SERVICE_URL ||
  "https://zestora-admin-api.onrender.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <AppProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
