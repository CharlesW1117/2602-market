import express from "express";
import db from "#db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();

// 🧩 Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send("Missing username or password");

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🧩 Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0)
      return res.status(401).send("Invalid credentials");

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🧩 Current user
router.get("/me", requireUser, async (req, res) => {
  res.json(req.user);
});

export default router;
