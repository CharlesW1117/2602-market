import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/**
 * Attaches the user to the request if a valid token is provided
 */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ error: "Invalid token" });
  }
}
