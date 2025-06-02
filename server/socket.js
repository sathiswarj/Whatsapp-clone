import conversationModel from "./models/conversationModel.js";

export default function registerSocketHandlers(io) {
    console.log("Socket Handlers called");

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
        console.log("User ID:", userId);

        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joins a personal room`);
        }

        socket.on("join", (otherUserId) => {
            socket.join(otherUserId);
            console.log(`User ${userId} joined chat with ${otherUserId}`);
        });

        socket.on("send-message", async (data) => {
            const { otherUserId, text } = data;

            try {
                let conversation = await conversationModel.findOne({
                    participants: { $all: [userId, otherUserId] }
                }).populate("participants");

                let isNew = false;

                if (!conversation) {
                    isNew = true;
                    conversation = new conversationModel({
                        participants: [userId, otherUserId]
                    });
                    await conversation.save();
                    await conversation.populate("participants");
                }

                socket.to(otherUserId).emit("receive-message", {
                    text,
                    conversation,
                    isNew
                });

            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
}
