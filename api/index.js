const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
require("dotenv").config({ path: require("path").join(__dirname, "../Backend/.env") });

const app = express();

const productRoutes = require("../Backend/routes/productRoutes");
const orderRoutes = require("../Backend/routes/orderRoutes");
const authRoutes = require("../Backend/routes/authRoutes");

const allowedOrigins = [
  "https://grocerywala.netlify.app",
  "https://www.grocerywala.netlify.app",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:5000"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("GroceryWala API is running");
});

let isConnected = false;

async function connectMongo() {
  if (!process.env.MONGO_URI || isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

connectMongo();

const handler = serverless(app);
module.exports = handler;
module.exports.handler = handler;
