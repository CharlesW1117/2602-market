import jwt from "jsonwebtoken";
import client from "../db/client.js";

export default async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("Missing Authorization header");
    }

    // Extract token correctly
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    


    // Query user from database
    const { rows } = await client.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(401).send("User not found");
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid or expired token");
  }
}
