import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  await db.query(`
    TRUNCATE order_products, orders, products, users RESTART IDENTITY CASCADE;
  `);

  // Insert one user
  const userResult = await db.query(`
    INSERT INTO users (username, password)
    VALUES ('charles', 'securepassword123')
    RETURNING id;
  `);
  const userId = userResult.rows[0].id;

  // Insert 10 distinct products
  const products = [
    ["Wireless Mouse", "Ergonomic wireless mouse with USB receiver", 25.99],
    ["Mechanical Keyboard", "RGB backlit mechanical keyboard", 89.99],
    ["Laptop Stand", "Adjustable aluminum laptop stand", 39.99],
    ["Noise Cancelling Headphones", "Over-ear Bluetooth headphones", 129.99],
    ["Webcam", "1080p HD webcam with built-in microphone", 49.99],
    ["USB-C Hub", "Multiport adapter with HDMI and USB 3.0", 34.99],
    ["Portable SSD", "1TB external solid-state drive", 119.99],
    ["Smartwatch", "Fitness tracker with heart rate monitor", 199.99],
    ["Desk Lamp", "LED lamp with adjustable brightness", 29.99],
    ["Bluetooth Speaker", "Compact speaker with deep bass", 59.99],
  ];

  for (const [title, description, price] of products) {
    await db.query(
      `INSERT INTO products (title, description, price) VALUES ($1, $2, $3);`,
      [title, description, price],
    );
  }

  // Insert one order for the user
  const orderResult = await db.query(
    `
    INSERT INTO orders (user_id, date)
    VALUES ($1, CURRENT_DATE)
    RETURNING id;
  `,
    [userId],
  );
  const orderId = orderResult.rows[0].id;

  // Link at least 5 distinct products to that order
  for (let i = 1; i <= 5; i++) {
    await db.query(
      `INSERT INTO order_products (order_id, product_id, quantity)
       VALUES ($1, $2, 1);`,
      [orderId, i],
    );
  }

  console.log("Database seeded successfully!");
}

await seed();
await db.end();
