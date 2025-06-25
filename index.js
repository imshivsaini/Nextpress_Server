import express from "express";
import "./connection.js";
import cors from "cors";
import NextPress from "./routes/nextpress.js";
import Auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", NextPress);
app.use("/api", Auth);

app.listen(8000, () => {
  console.log("Server Chal rha h");
});
