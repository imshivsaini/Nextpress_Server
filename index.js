import express from "express";
import "./config/connection.js";
import cors from "cors";
import NextPress from "./routes/nextpress.js";
import cookieParser from "cookie-parser";
import Auth from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api",NextPress);
app.use("/api", Auth);


app.listen(8000, () => {
  console.log("Server Chal rha h");
});
