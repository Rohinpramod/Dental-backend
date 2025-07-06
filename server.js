import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { PORT, connectDB } from "./config/db.js";

import userRoutes from "./routes/auth.js";
import itemRoutes from "./routes/menuiItemsRouter.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRouter.js";

import CategoryRoutes from './routes/categoryRoutes.js'
import StudentsSection from './routes/StudentsSectionCardRoutes.js'

import authMiddleware from "./middlewares/authMiddleware.js";
import roleMiddleware from "./middlewares/roleMiddleware.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pickle-walah-dashboard.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Database connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/address", authMiddleware, addressRoutes);
app.use("/api/coupon", authMiddleware, couponRoutes);
app.use("/api/order", authMiddleware, orderRoutes);
app.use('/api/students-section',StudentsSection)

app.use("/api/category",CategoryRoutes)

// Default route
app.get("/", (req, res) => {
  res.send("API Running Dental Project");
});

// Catch-all for invalid endpoints
app.all("*", (req, res) => {
  res.status(404).json({ message: "End point does not exist" });
});

// Start server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
