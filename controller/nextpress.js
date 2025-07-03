import url from "../Models/url.js";
import mongoose from "mongoose";
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
      publisherId: req.user.id,
    });
    if (response) {
      return res
        .status(409)
        .json({ success: false, message: "Already Exists" });
    }
    const requestData = { url: urlParam, publisherId: req.user.id };
    // Database query for Creation
    await url.create(requestData);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Convert publisherId from string to ObjectId
    const publisherId = new mongoose.Types.ObjectId(req.user.id);

    // Build combined search query
    let searchQuery = {
      publisherId: publisherId,
    };

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      searchQuery = {
        $and: [
          { publisherId: publisherId },
          {
            $or: [
              { url: { $regex: searchRegex } },
              { status: { $regex: searchRegex } },
            ],
          },
        ],
      };
    }

    const total = await url.countDocuments(searchQuery);

    const data = await url.aggregate([
      { $match: searchQuery },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "publisherId",
          foreignField: "_id",
          as: "publisher",
        },
      },
      {
        $unwind: {
          path: "$publisher",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          url: 1,
          content: 1,
          root: 1,
          status: 1,
          publisherId: 1,
          createdAt: 1,
          updatedAt: 1,
          "publisher._id": 1,
          "publisher.username": 1,
        },
      },
    ]);

    const total_pages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data,
      page,
      limit,
      total,
      total_pages,
      search: search || null,
      has_search: !!search.trim(),
    });
  } catch (err) {
    console.error("Error in GetUrl:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const GetSpeUrl = async (req, res) => {
  try {
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
    const data = await url
      .findOne({ url: decodedUrl, publisherId: req.user.id })
      .lean();

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

    if (!content && !root) {
      return res.status(400).json({
        success: false,
        message: "At least one field (content or root) is required for update",
      });
    }

    const data = await url.findOne({ url: req.params.url });
    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

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
