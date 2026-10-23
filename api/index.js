const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
require("dotenv").config({ path: require("path").join(__dirname, "../Backend/.env") });

const app = express();

const productRoutes = require("../Backend/routes/productRoutes");
const orderRoutes = require("../Backend/routes/orderRoutes");
const authRoutes = require("../Backend/routes/authRoutes");

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

module.exports = app;
module.exports.handler = serverless(app);
