import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  getOrdersByUserId,
  getOrderById,
  createOrder,
  addProductToOrder,
  getProductsInOrder,
} from "..db/queries/orders.js";

const router = express.Router();

// Get all orders for logged‑in user
router.get("/", requireUser, async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create new order
router.post("/", requireUser, async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date) return res.status(400).send("Missing date");

    const order = await createOrder(req.user.id, date, note);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View specific order
router.get("/:id", requireUser, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);
    if (!order) return res.status(404).send("Order not found");
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

    const order = await getOrderById(orderId);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Not authorized");

    const added = await addProductToOrder(orderId, productId, quantity);
    res.status(201).json(added);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View products in an order
router.get("/:id/products", requireUser, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Not authorized");

    const products = await getProductsInOrder(orderId);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
