import url from "../Models/url.js";

export const AddUrl = async (req, res) => {
  try {
    // Input validation
    const { url: urlParam } = req.body;

    if (!urlParam) {
      return res.status(400).json({
        success: false,
        message: "URL parameter is required",
      });
    }
    // Database query for finding
    const response = await url.findOne({
      url: urlParam,
    });
    if (response) {
      return res
        .status(409)
        .json({ success: false, message: "Already Exists" });
    }
    // Database query for Creation
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const GetSpeUrl = async (req, res) => {
  try {
    // Input validation
    const { url: urlParam } = req.params;

    if (!urlParam) {
      return res.status(400).json({
        success: false,
        message: "URL parameter is required",
      });
    }

    // Decode URL parameter to handle encoded URLs
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(urlParam);
    } catch (decodeError) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Database query
    const data = await url.findOne({ url: decodedUrl }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const UpdateSpeUrl = async (req, res) => {
  try {
    const { content, root, status } = req.body;
    // Validate required fields
    if (!content && !root) {
      return res.status(400).json({
        success: false,
        message: "At least one field (content or root) is required for update",
      });
    }

    // Find the URL record in the database
    const data = await url.findOne({ url: req.params.url });
    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Update fields only if provided in request body
    if (content !== undefined) {
      data.content = content;
    }
    if (status === "Published" || status === "Draft") {
      data.status = status;
    }
    if (root !== undefined) {
      data.root = root;
    }
    await data.save();

    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const DeleteUrl = async (req, res) => {
  try {
    // Extract and validate the ID parameter
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }
    // Find and delete the URL record
    const data = await url.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Url not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
