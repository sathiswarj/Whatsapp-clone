import conversationModel from "./models/conversationModel.js";
import messageModel from './models/messageModel.js';

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

        socket.on("send-message", async (data) => {
            const { otherUserId, text } = data;

            if (!otherUserId || !text) {
                return console.warn("Missing data in send-message", data);
            }

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


                // save messagge
                const message = new messageModel({
                    conversationId: conversation._id,
                    senderId: userId,
                    text
                });

                await message.save();

                // Update Unread Count
                const currentUnread = conversation.unreadCounts.get(otherUserId.toString()) || 0;
                conversation.unreadCounts.set(otherUserId.toString(), currentUnread + 1);
                conversation.markModified("unreadCounts"); // Notify Mongoose

                // Update Last Activity
                conversation.lastMessage = message;

                // Save updated conversation
                await conversation.save();


                io.to(otherUserId).emit("receive-message", {
                    text,
                    conversation,
                    isNew
                });

            } catch (error) {
                console.error("Error sending message:", error, "Payload:", data);
            }
        });

        socket.on("focus-conversation", async (conversationId) => {
            try {
                const conversation = await conversationModel.findById(conversationId)
                if (!conversation) {
                    return
                }
                conversation.unreadCounts.set(userId, 0);
                conversation.markModified("unreadCounts");
                await conversation.save();

            } catch (error) {
                console.log("Focus conversation error", error)
            }
        })


    });
}


// import conversationModel from "./models/conversationModel.js";
// import messageModel from './models/messageModel.js';

// export default function registerSocketHandlers(io) {
//     console.log("Socket Handlers called");

//     io.on("connection", (socket) => {
//         console.log("New socket connection:", socket.id);

//         const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
//         console.log("User ID:", userId);

//         if (userId) {
//             socket.join(userId);
//             console.log(`User ${userId} joins a personal room`);
//         }

//         socket.on("send-message", async (data) => {
//             const { otherUserId, text } = data;

//             if (!otherUserId || !text) {
//                 return console.warn("Missing data in send-message", data);
//             }

//             try {
//                 let conversation = await conversationModel.findOne({
//                     participants: { $all: [userId, otherUserId] }
//                 }).populate("participants");

//                 let isNew = false;

//                 if (!conversation) {
//                     isNew = true;
//                     conversation = new conversationModel({
//                         participants: [userId, otherUserId]
//                     });
//                     await conversation.save();
//                     await conversation.populate("participants");
//                 }


//                 // save messagge
//                 const message = new messageModel({
//                     conversationId: conversation._id,
//                     senderId: userId,
//                     text
//                 });

//                 await message.save();

//                 // Update Unread Count
//                 const currentUnread = conversation.unreadCounts.get(otherUserId.toString()) || 0;
//                 conversation.unreadCounts.set(otherUserId.toString(), currentUnread + 1);
//                 conversation.markModified("unreadCounts"); // Notify Mongoose

//                 // Update Last Activity
//                 conversation.lastMessage = message;

//                 // Save updated conversation
//                 await conversation.save();


//                 io.to(otherUserId).emit("receive-message", {
//                     text,
//                     conversation,
//                     isNew
//                 });

//             } catch (error) {
//                 console.error("Error sending message:", error, "Payload:", data);
//             }
//         });

//         socket.on("focus-conversation", async (conversationId) => {
//             try {
//                 const conversation = await conversationModel.findById(conversationId)
//                 if (!conversation) {
//                     return
//                 }
//                 conversation.unreadCounts.set(userId, 0);
//                 conversation.markModified("unreadCounts");
//                 await conversation.save();

//             } catch (error) {
//                 console.log("Focus conversation error", error)
//             }
//         })
//         socket.on("clear-unread", async ({ chatId, userId }) => {
//             try {
//                 const conversation = await conversationModel.findById(chatId);
//                 if (!conversation) return;

//                 conversation.unreadCounts.set(userId, 0);
//                 conversation.markModified("unreadCounts");
//                 await conversation.save();
//             } catch (err) {
//                 console.log("clear-unread error", err);
//             }
//         });

//     });
// }
