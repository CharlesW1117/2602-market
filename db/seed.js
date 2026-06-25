import db from "#db/client";

async function seed() {
  try {
    // Connect once before running queries
    await db.connect();

    // Clear existing data
    await db.query(`
      TRUNCATE orders_products, orders, products, users
      RESTART IDENTITY CASCADE;
    `);

    // Insert one user
    const userResult = await db.query(`
      INSERT INTO users (username, password)
      VALUES ('charles', 'securepassword123')
      RETURNING id;
    `);
    const userId = userResult.rows[0].id;

    // Insert distinct products
    const products = [
      ["Wireless Mouse", "Ergonomic wireless mouse with USB", 25.99],
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
        `INSERT INTO products (title, description, price)
         VALUES ($1, $2, $3);`,
        [title, description, price],
      );
    }

    // Create one order for the user
    const orderResult = await db.query(
      `
      INSERT INTO orders (user_id, date)
      VALUES ($1, CURRENT_DATE)
      RETURNING id;
    `,
      [userId],
    );
    const orderId = orderResult.rows[0].id;

    // Add 5 distinct products to that order
    for (let i = 1; i <= 5; i++) {
      await db.query(
        `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3);
      `,
        [orderId, i, 1],
      );
    }

    console.log("🌱 Database seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    // ✅ Disconnect after seeding
    await db.end();
  }
}

seed();
