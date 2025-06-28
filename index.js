import express from "express";
import "./connection.js";
import cors from "cors";
import NextPress from "./routes/nextpress.js";
import Auth from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["https://nextpress.genvwebsters.com", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", NextPress);
app.use("/api", Auth);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(8000, () => {
    console.log("Server Chal rha h");
  });
}

// Export the Express API for Vercel
export default app;
