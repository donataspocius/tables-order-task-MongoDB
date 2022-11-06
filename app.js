const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const Order = require("./models/orders.model.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connection to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoBD");

  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
});

// Routes
// GET /api/portfolio   --> get all tables made (portfolio)
app.get("/api/portfolio", async (req, res) => {
  try {
    const allOrders = await Order.find({});
    const portfolio = allOrders.map((order) => order.tablesOrdered);

    res
      .status(200)
      .json({ status: "success", results: portfolio.length, portfolio });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: `Error getting portfolio: ${error}` });
  }
});

// POST /api/orders/    --> place an order
app.post("/api/orders", async (req, res) => {
  const newOrder = req.body;

  try {
    const order = new Order(newOrder);
    await order.save();

    res.status(201).json({ message: "Order saved", order });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: `Error placing order: ${error}` });
  }
});

// GET /api/orders/     --> get all active orders
app.get("/api/orders", async (req, res) => {
  try {
    const allOrders = await Order.find({});
    const activeOrders = allOrders.filter((order) => !order.isCompleted);

    res
      .status(200)
      .json({ status: "success", results: activeOrders.length, activeOrders });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Error getting all open orders: ${error}`,
    });
  }
});

// PUT /api/orders/:id  --> mark order as completed
app.put("/api/orders/:id", async (req, res) => {
  const orderId = req.params.id;
  const orderStatus = req.body;

  try {
    await Order.findByIdAndUpdate(orderId, orderStatus);
    const completedOrder = await Order.findById(orderId);

    res.status(200).json({ status: "success", completedOrder });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Error marking order as completed: ${error}`,
    });
  }
});
