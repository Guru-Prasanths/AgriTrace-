/**
 * Order Controller for AgriTrace
 * Manages order lifecycles and triggers transaction-safe completion points and reversals.
 */

const orderModel = require("../models/orderModel");
const rewardModel = require("../models/rewardModel");

async function createOrder(req, res) {
  try {
    const { produceRecordId, farmerId, sellerId, cropName, quantity, unitPrice, notes } = req.body;

    if (!cropName || !quantity || !unitPrice) {
      return res.status(400).json({ error: "Crop name, quantity, and unit price are required." });
    }

    // Assign farmer/seller based on current user role if not provided
    let actualFarmerId = farmerId;
    let actualSellerId = sellerId;

    if (req.user.role === "farmer") {
      actualFarmerId = req.user.id;
      if (!actualSellerId) actualSellerId = "user-seller-001"; // Fallback demo seller
    } else if (req.user.role === "seller") {
      actualSellerId = req.user.id;
      if (!actualFarmerId) actualFarmerId = "user-farmer-001"; // Fallback demo farmer
    }

    const qty = Number(quantity);
    const price = Number(unitPrice);
    const totalPrice = qty * price;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = await orderModel.createOrder({
      orderNumber,
      produceRecordId: produceRecordId || null,
      farmerId: actualFarmerId,
      sellerId: actualSellerId,
      cropName,
      quantity: qty,
      unitPrice: price,
      totalPrice,
      notes: notes || null
    });

    return res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (err) {
    console.error("[createOrder error]", err);
    return res.status(500).json({ error: "Failed to create order", message: err.message });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await orderModel.listOrdersForUser(req.user.id, req.user.role);
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list orders", message: err.message });
  }
}

async function getOrder(req, res) {
  try {
    const order = await orderModel.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.role !== "admin" && order.farmer_id !== req.user.id && order.seller_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied to this order" });
    }

    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch order", message: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ["created", "pending", "paid", "in_progress", "completed", "cancelled", "rejected", "reversed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(", ")}`
      });
    }

    const order = await orderModel.findOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Role check: Only participants or admin can modify order status
    if (req.user.role !== "admin" && order.farmer_id !== req.user.id && order.seller_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden", message: "You are not authorized to update this order." });
    }

    const previousStatus = order.status;
    if (previousStatus === status) {
      return res.json({ message: `Order is already in status '${status}'`, order });
    }

    // Update status in DB
    const updatedOrder = await orderModel.updateOrderStatus(orderId, status);

    let rewardResult = null;

    // Feature 3: Product completion points
    if (status === "completed" && previousStatus !== "completed") {
      rewardResult = await rewardModel.awardCompletionPointsForOrder(updatedOrder);
    } else if (status === "reversed" && previousStatus === "completed") {
      // Reversal logic
      rewardResult = await rewardModel.reverseOrderPoints(updatedOrder);
    }

    return res.json({
      message: `Order status updated to '${status}'`,
      previousStatus,
      order: updatedOrder,
      rewardResult
    });
  } catch (err) {
    console.error("[updateStatus error]", err);
    return res.status(500).json({ error: "Failed to update order status", message: err.message });
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateStatus
};

