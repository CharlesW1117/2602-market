import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  getAllProducts,
  getProductById,
  getOrdersForProductByUser,
} from "../db/queries/products.js";

const router = express.Router();

// GET /products — all products
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /products/:id — single product
router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//  GET /products/:id/orders — orders by logged‑in user that include this product
router.get("/:id/orders", requireUser, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists first
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Then get orders for this user that include the product
    const orders = await getOrdersForProductByUser(productId, req.user.id);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
