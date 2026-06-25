import db from "../client.js";

export async function createOrder({ date, note, user_id }) {
  const {
    rows: [order],
  } = await db.query(
    "INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *",
    [date, note, user_id],
  );
  return order;
}

export async function getOrdersByUser(user_id) {
  const { rows } = await db.query("SELECT * FROM orders WHERE user_id = $1", [
    user_id,
  ]);
  return rows;
}

export async function getOrderById(id) {
  const {
    rows: [order],
  } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return order;
}

export async function addProductToOrder(order_id, product_id, quantity) {
  const {
    rows: [record],
  } = await db.query(
    "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [order_id, product_id, quantity],
  );
  return record;
}

export async function getProductsInOrder(order_id) {
  const { rows } = await db.query(
    `SELECT p.id, p.title, p.description, p.price, op.quantity
     FROM orders_products AS op
     JOIN products AS p ON op.product_id = p.id
     WHERE op.order_id = $1`,
    [order_id],
  );
  return rows;
}
