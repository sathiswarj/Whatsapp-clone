import mongoose, { Mongoose } from "mongoose";

export const conversationSchema = new mongoose.Schema({
    participants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        validate: [arr => arr.length === 2, "A conversation must have two participants"]
    },
})

const conversationModel = mongoose.model("Conversation", conversationSchema)

export default conversationModel