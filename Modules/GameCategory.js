import mongoose from "mongoose";
const { Schema } = mongoose

const gameCatSchema = new Schema({
    category: String
}, { timestamps: true })

export default mongoose.model("Game Category", gameCatSchema)