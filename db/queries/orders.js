import db from "#db/client";

// Get all orders for a specific user
export async function getOrdersByUserId(userId) {
  const result = await db.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY id;",
    [userId],
  );
  return result.rows;
}

// Get a single order by ID
export async function getOrderById(orderId) {
  const result = await db.query("SELECT * FROM orders WHERE id = $1;", [
    orderId,
  ]);
  return result.rows[0];
}

// Create a new order
export async function createOrder(userId, date, note = null) {
  const result = await db.query(
    "INSERT INTO orders (user_id, date, note) VALUES ($1, $2, $3) RETURNING *;",
    [userId, date, note],
  );
  return result.rows[0];
}

// Add a product to an order
export async function addProductToOrder(orderId, productId, quantity) {
  const result = await db.query(
    "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;",
    [orderId, productId, quantity],
  );
  return result.rows[0];
}

// Get all products in an order
export async function getProductsInOrder(orderId) {
  const result = await db.query(
    `SELECT p.id, p.title, p.description, p.price, op.quantity
     FROM orders_products AS op
     JOIN products AS p ON op.product_id = p.id
     WHERE op.order_id = $1;`,
    [orderId],
  );
  return result.rows;
}
