import express from 'express';
import conversationModel from '../models/conversationModel.js';
import mongoose from 'mongoose';

const router = express.Router();

//Get all converstion for a user
// conversation/:userId
router.get("/:userId", async (req, res) => {
    try {
        let conversation = await conversationModel.find({
            participants: req.params.userId
        })
            .populate("participants")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })

        conversation.map(conv => {
            conv.participants.map((user) => {
                user.profileImg = user.profileImg ? `${req.protocol}://${req.get('host')}${user.profileImg}` : null;
                return user;
            })
            return conv
        })
        res.json(conversation)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/delete", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid IDs format" });
  }

  try {
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    await conversationModel.deleteMany({ _id: { $in: objectIds } });
    res.status(200).json({ message: "Conversation(s) deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;