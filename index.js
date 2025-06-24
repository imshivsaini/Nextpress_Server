import express from "express";
import "./connection.js";
import url from "./Models/url.js";
import cors from "cors";

const app = express();
app.use(cors());
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
    const data = await url.find();
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
});

app.get("/get-specific/:url", async (req, res) => {
  try {
    const data = await url.findOne({ url: req.params.url });
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
});

app.put("/update-specific/:url", async (req, res) => {
  try {
    const { content, root } = req.body;
    const data = await url.findOne({ url: req.params.url });
    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    data.content = content;
    data.root = root;
    await data.save();
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
});

app.listen(8000, () => {
  console.log("Server Chal rha h");
});
