import express from "express";
import "./connection.js";
import cors from "cors";
import NextPress from "./routes/nextpress.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", NextPress);

app.listen(8000, () => {
  console.log("Server Chal rha h");
});
