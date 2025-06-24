import url from "../Models/url.js";
export const AddUrl = async(req,res) =>{
    try {
    const response = await url.findOne({
      url: req.body.url,
    });
    if (response) {
      return res.status(401).json({ success: false, message: "Already Exists" });
    }
    await url.create(req.body);
    return res.status(200).json({ success: true, message: "Added Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const GetUrl = async(req,res) =>{
try {
    const data = await url.find();
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
}

export const GetSpeUrl = async(req,res) =>{
    try {
    const data = await url.findOne({ url: req.params.url });
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
}

export const UpdateSpeUrl = async(req,res) => {
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
}