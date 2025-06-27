import url from "../Models/url.js";

export const AddUrl = async (req, res) => {
  try {
    const response = await url.findOne({
      url: req.body.url,
    });
    if (response) {
      return res
        .status(409)
        .json({ success: false, message: "Already Exists" });
    }
    await url.create(req.body);
    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const GetUrl = async (req, res) => {
  try {
    // Get page and limit from query params, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Get total number of documents
    const total = await url.countDocuments();

    // Get the paginated data
    const data = await url.find().skip(skip).limit(limit);

    // Calculate total pages
    const total_pages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data,
      page,
      limit,
      total,
      total_pages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const GetSpeUrl = async (req, res) => {
  try {
    const data = await url.findOne({ url: req.params.url });
    if (!data) {
      return res.status(404).json({ success: false, message: "No data found" });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
};

export const UpdateSpeUrl = async (req, res) => {
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
};

export const DeleteUrl = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await url.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Url not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
};
