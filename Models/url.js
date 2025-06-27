import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: [mongoose.Schema.Types.Mixed],
    },
    root: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const url = mongoose.model("url", urlSchema);

export default url;
