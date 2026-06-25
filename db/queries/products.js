import db from "../client.js";

export async function getAllProducts() {
  const { rows } = await db.query("SELECT * FROM products");
  return rows;
}

export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
  return product;
}

export async function getOrdersForProductByUser(product_id, user_id) {
  const { rows } = await db.query(
    `SELECT o.id, o.date, o.note
     FROM orders AS o
     JOIN orders_products AS op ON o.id = op.order_id
     WHERE o.user_id = $1 AND op.product_id = $2`,
    [user_id, product_id],
  );
  return rows;
}
