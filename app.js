import express from "express";

const app = express();

// This line lets Express automatically parse JSON in incoming requests
app.use(express.json());

export default app;
