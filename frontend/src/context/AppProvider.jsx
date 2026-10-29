import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { authService, restaurantService } from "../main";
import { Toaster } from "react-hot-toast";
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(() =>
    Boolean(navigator.geolocation),
  );
  const [city, setCity] = useState("Fecthing Location...");
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${authService}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [quauntity, setQuauntity] = useState(0);
  const fetchCart = useCallback(async () => {
    if (!user || user.role !== "customer") return;
    try {
      const { data } = await axios.get(`${restaurantService}/api/cart/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(data.cart || []);
      setSubTotal(data.subtotal || 0);
      setQuauntity(data.cartLength);
    } catch (error) {
      console.log(error);
    }
  }, [user]);
  useEffect(() => {
    const timer = setTimeout(fetchUser, 0);
    return () => clearTimeout(timer);
  }, [fetchUser]);
  useEffect(() => {
    if (!user || user.role !== "customer") return;
    const timer = setTimeout(fetchCart, 0);
    return () => clearTimeout(timer);
  }, [user, fetchCart]);
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Please Allow Location to continue");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );
        const data = await res.json();
        setLocation({
          latitude,
          longitude,
          formattedAddress: data.display_name || "current location",
        });
        setCity(
          data.address.city ||
            data.address.town ||
            data.address.village ||
            "Your Location",
        );
        setLoadingLocation(false);
      } catch {
        setLocation({
          latitude,
          longitude,
          formattedAddress: "Current Location",
        });
        setCity("Faild to load");
        setLoadingLocation(false);
      }
    });
  }, []);
  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        location,
        loadingLocation,
        city,
        cart,
        fetchCart,
        quauntity,
        subTotal,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};
