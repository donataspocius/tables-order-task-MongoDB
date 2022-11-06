const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customerName: {
    type: String,
    trim: true,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    trim: true,
    // unique: true,
    required: [true, "Please enter your email"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your phone"],
  },
  tablesOrdered: {
    type: Array,
    required: true,
    default: [],
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
