import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import audio from "../assets/quack.mp3";
import axios from "axios";
import { restaurantService } from "../main";
import OrderCard from "./OrderCard";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready_for_rider",
  "rider_assigned",
  "picked_up",
];
const RestaurantOrders = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const { socket } = useSocket();
  const { unlock, playFromStart } = useAudioPlayer(audio);
  const unlockAudio = () => {
    unlock(
      () => {
        setAudioUnlocked(true);
        console.log("Audio unlocked");
      },
      (err) => console.log("Failed to unlock audio: ", err),
    );
  };
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/order/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);
  useEffect(() => {
    const timer = setTimeout(fetchOrders, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);
  useEffect(() => {
    if (!socket) return;
    const onNewOrder = () => {
      console.log("New Order recived socket");
      if (audioUnlocked)
        playFromStart((err) => console.error("Audio play failed:", err));
      fetchOrders();
    };
    socket.on("order:new", onNewOrder);
    return () => {
      socket.off("order:new", onNewOrder);
    };
  }, [socket, audioUnlocked, fetchOrders, playFromStart]);
  useEffect(() => {
    if (!socket) return;
    const onUpdateOrder = () => {
      fetchOrders();
    };
    socket.on("order:rider_assigned", onUpdateOrder);
    return () => {
      socket.off("order:rider_assigned", onUpdateOrder);
    };
  }, [socket, fetchOrders]);
  if (loading) {
    return <p className="text-gray-500">Loading Orders</p>;
  }
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const completedOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status),
  );
  return (
    <div className="space-y-6">
      {!audioUnlocked && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-medium text-blue-900">
                Enable Sound Notification
              </p>
              <p className="text-sm text-blue-700">
                Get Notified when new orders arrive
              </p>
            </div>
          </div>
          <button
            onClick={unlockAudio}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Enable sound
          </button>
        </div>
      )}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Active Orders</h3>
        {activeOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No Acitve orders</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order) => (
              <OrderCard
                order={order}
                onStatusUpdate={fetchOrders}
                key={order._id}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Completed Orders</h3>
        {completedOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No completed orders</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedOrders.map((order) => (
              <OrderCard
                order={order}
                onStatusUpdate={fetchOrders}
                key={order._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default RestaurantOrders;
