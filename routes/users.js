import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername, createUser } from "../db/queries/users.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecret";

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Missing username or password");
    }

    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);

    // Create token and send only the token string
    const token = jwt.sign({ id: user.id }, SECRET);
    res.status(201).send(token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Missing username or password");
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, SECRET);
    res.status(200).send(token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
