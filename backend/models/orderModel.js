/**
 * Order Model for AgriTrace
 * Handles supply chain purchase orders between Farmers and Sellers.
 */

const db = require("../config/db");

async function findOrderById(id) {
  const result = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function listOrdersForUser(userId, role) {
  if (role === "admin") {
    const result = await db.query("SELECT * FROM orders ORDER BY created_at DESC", []);
    return result.rows;
  }
  const result = await db.query(
    "SELECT * FROM orders WHERE farmer_id = $1 OR seller_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

async function createOrder({
  orderNumber,
  produceRecordId = null,
  farmerId,
  sellerId,
  cropName,
  quantity,
  unitPrice,
  totalPrice,
  notes = null
}) {
  const result = await db.query(
    `INSERT INTO orders (order_number, produce_record_id, farmer_id, seller_id, crop_name, quantity, unit_price, total_price, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'created', $9)
     RETURNING *`,
    [orderNumber, produceRecordId, farmerId, sellerId, cropName, quantity, unitPrice, totalPrice, notes]
  );
  return result.rows[0];
}

async function updateOrderStatus(id, newStatus) {
  const result = await db.query(
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [newStatus, id]
  );
  return result.rows[0] || null;
}

module.exports = {
  findOrderById,
  listOrdersForUser,
  createOrder,
  updateOrderStatus
};

