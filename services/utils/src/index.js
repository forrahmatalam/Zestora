import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/imagekit.js";
import paymentRoutes from "./routes/payment.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();
connectRabbitMQ().catch((error) => {
  console.error(
    "RabbitMQ unavailable; payment queue features are disabled until it is available:",
    error.message,
  );
});
const app = express();
app.use(cors());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", uploadRoutes);
app.use("/api/payment", paymentRoutes);
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Utils service is running on port ${PORT}`);
});
