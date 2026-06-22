import express from "express";
import db from "#db/client";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).send("Product not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get orders for a product (protected)
router.get("/:id/orders", requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const productCheck = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id],
    );
    if (productCheck.rows.length === 0)
      return res.status(404).send("Product not found");

    const result = await db.query(
      `SELECT o.*
       FROM orders o
       JOIN orders_products op ON o.id = op.order_id
       WHERE op.product_id = $1 AND o.user_id = $2`,
      [id, req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
