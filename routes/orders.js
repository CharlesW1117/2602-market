import express from "express";
import db from "#db/client";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();

// Get all orders for logged‑in user
router.get("/", requireUser, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create new order
router.post("/", requireUser, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).send("Missing date");

    const orderResult = await db.query(
      "INSERT INTO orders (user_id, date) VALUES ($1, $2) RETURNING *",
      [req.user.id, date],
    );

    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View specific order
router.get("/:id", requireUser, async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderCheck = await db.query("SELECT * FROM orders WHERE id = $1", [
      orderId,
    ]);
    if (orderCheck.rows.length === 0)
      return res.status(404).send("Order not found");

    const order = orderCheck.rows[0];
    if (order.user_id !== req.user.id)
      return res.status(403).send("Not authorized");

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add product to order
router.post("/:id/products", requireUser, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res.status(400).send("Missing productId or quantity");

    const orderCheck = await db.query("SELECT * FROM orders WHERE id = $1", [
      orderId,
    ]);
    if (orderCheck.rows.length === 0)
      return res.status(404).send("Order not found");

    const order = orderCheck.rows[0];
    if (order.user_id !== req.user.id)
      return res.status(403).send("Not authorized");

    const productCheck = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [productId],
    );
    if (productCheck.rows.length === 0)
      return res.status(400).send("Product does not exist");

    const result = await db.query(
      "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [orderId, productId, quantity],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View products in an order
router.get("/:id/products", requireUser, async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderCheck = await db.query("SELECT * FROM orders WHERE id = $1", [
      orderId,
    ]);
    if (orderCheck.rows.length === 0)
      return res.status(404).send("Order not found");

    const order = orderCheck.rows[0];
    if (order.user_id !== req.user.id)
      return res.status(403).send("Not authorized");

    const result = await db.query(
      `SELECT p.id, p.title, p.description, p.price, op.quantity
       FROM orders_products AS op
       JOIN products AS p ON op.product_id = p.id
       WHERE op.order_id = $1`,
      [orderId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
