import express from "express";
import "./connection.js";
import url from "./Models/url.js";

const app = express();
app.use(express.json());

app.post("/add-url", async (req, res) => {
  try {
    const response = await url.findOne({
      url: req.body.url,
    });
    if (response) {
      return res.status(401).json("Already exist");
    }
    await url.create(req.body);
    return res.status(200).json("Added Successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server Error");
  }
});

app.get("/get-url", async (req, res) => {
  try {
    const url = await url.findAll();
    return res.status(200).json({ success: true, data: url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
});

app.listen(8000, () => {
  console.log("Server Chal rha h");
});
