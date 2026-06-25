import jwt from "jsonwebtoken";
import { getUserById } from "../db/queries/users.js";

/**
 * Attaches the user to the request if a valid token is provided
 */
export default async function getUserFromToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await getUserById(id);
  } catch (err) {
    req.user = null;
  }

  next();
}
