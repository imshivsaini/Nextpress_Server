import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        url: {
            unique:true,
            type: String,
            required: true
        },
        content : {
            type:[mongoose.Schema.Types.Mixed]
        },
        root : {
            type:mongoose.Schema.Types.Mixed
        }
    }
)

const url = mongoose.model("url",urlSchema);
export default url;