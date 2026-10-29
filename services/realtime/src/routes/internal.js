import express from "express";
import jwt from "jsonwebtoken";
import { getIO } from "../socket.js";
const router = express.Router();
router.post("/emit", async (req, res) => {
  const { event, room, payload } = req.body;
  if (!event || !room) {
    return res.status(400).json({
      message: "event and room are required",
    });
  }

  if (event === "rider:location") {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication is required" });
    }

    const token = authorization.slice("Bearer ".length);
    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded?.user;
    } catch {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (user?.role !== "rider") {
      return res
        .status(403)
        .json({ message: "Only riders can share location" });
    }

    const { latitude, longitude } = payload || {};
    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res
        .status(400)
        .json({ message: "Valid coordinates are required" });
    }

    let riderOrderResponse;
    try {
      riderOrderResponse = await fetch(
        `${process.env.RIDER_SERVICE}/api/rider/order/current`,
        { headers: { Authorization: authorization } },
      );
    } catch {
      return res
        .status(502)
        .json({ message: "Could not verify the rider's order" });
    }

    if (!riderOrderResponse.ok) {
      return res.status(403).json({ message: "Rider has no active delivery" });
    }

    const { order } = await riderOrderResponse.json();
    if (!order?.userId || room !== `user:${order.userId}`) {
      return res
        .status(403)
        .json({ message: "Rider is not assigned to this user" });
    }
  } else if (
    req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_SECRET
  ) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const io = getIO();
  console.log(`📶 Emitting event ${event} to room ${room}`);
  io.to(room).emit(event, payload ?? {});
  return res.json({ sucess: true });
});
export default router;
