import mongoose from "mongoose";

export const conversationSchema = new mongoose.Schema({
    participants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        validate: [arr => arr.length === 2, "A conversation must have two participants"]
    },
    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    unreadCounts:{
        type: Map,
        of: Number,
        default: {}
    }
})

const conversationModel = mongoose.model("Conversation", conversationSchema)

export default conversationModel