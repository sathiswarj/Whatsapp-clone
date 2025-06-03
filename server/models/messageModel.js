import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["Sent", "Delivered", "Seen"],
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model("Message", messageSchema); // Capitalized 'Message'

export default messageModel;
