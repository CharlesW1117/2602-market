-- Clear existing data
TRUNCATE order_products, orders, products, users RESTART IDENTITY CASCADE;

-- Insert one user
INSERT INTO users (username, password)
VALUES ('charles', 'securepassword123');

-- Insert 10 distinct products
INSERT INTO products (title, description, price) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 25.99),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 89.99),
('Laptop Stand', 'Adjustable aluminum laptop stand', 39.99),
('Noise Cancelling Headphones', 'Over-ear Bluetooth headphones', 129.99),
('Webcam', '1080p HD webcam with built-in microphone', 49.99),
('USB-C Hub', 'Multiport adapter with HDMI and USB 3.0', 34.99),
('Portable SSD', '1TB external solid-state drive', 119.99),
('Smartwatch', 'Fitness tracker with heart rate monitor', 199.99),
('Desk Lamp', 'LED lamp with adjustable brightness', 29.99),
('Bluetooth Speaker', 'Compact speaker with deep bass', 59.99);

-- Insert one order for the user
INSERT INTO orders (user_id, date)
VALUES (1, CURRENT_DATE);

-- Link at least 5 distinct products to that order
INSERT INTO order_products (order_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 4, 1),
(1, 6, 1),
(1, 9, 1);
