import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    title: String,
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Game Category"
    },
    shortDes: String,
    thumbnail: String,
    gameUrl: String,
    description: String,
    howToPlay: String,
    whoCreated: String,
    keywords: [String],
    orientation: String,
}, { timestamps: true });

export default mongoose.model("Games", productSchema);
