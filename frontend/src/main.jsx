import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/AppProvider.jsx";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketProvider.jsx";
const serviceUrl = (key, localUrl, productionUrl) => {
  const configuredUrl = import.meta.env[key];
  if (import.meta.env.PROD) {
    return configuredUrl && !/localhost|127\.0\.0\.1/i.test(configuredUrl)
      ? configuredUrl
      : productionUrl;
  }
  return configuredUrl || localUrl;
};
export const authService = serviceUrl(
  "VITE_AUTH_SERVICE_URL",
  "http://localhost:5010",
  "https://zestora-auth-api.onrender.com",
);
export const restaurantService = serviceUrl(
  "VITE_RESTAURANT_SERVICE_URL",
  "http://localhost:5001",
  "https://zestora-restaurant-api.onrender.com",
);
export const utilsService = serviceUrl(
  "VITE_UTILS_SERVICE_URL",
  "http://localhost:5002",
  "https://zestora-utils-api.onrender.com",
);
export const realtimeService = serviceUrl(
  "VITE_REALTIME_SERVICE_URL",
  "http://localhost:5004",
  "https://zestora-realtime-api.onrender.com",
);
export const riderService = serviceUrl(
  "VITE_RIDER_SERVICE_URL",
  "http://localhost:5005",
  "https://zestora-rider-api.onrender.com",
);
export const adminService = serviceUrl(
  "VITE_ADMIN_SERVICE_URL",
  "http://localhost:5006",
  "https://zestora-admin-api.onrender.com",
);
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
