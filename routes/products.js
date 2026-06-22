import express from "express";
import db from "#db/client";

const router = express.Router();

// 🧩 Get all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
