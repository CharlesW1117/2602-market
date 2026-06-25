import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import getUserFromToken from "./middleware/getUserFromToken.js";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Attach decoded user to each request before protected routes
app.use(getUserFromToken);

// Mount routers
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

// Home route
app.get("/", (req, res) => {
  res.send("market-API is running!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
