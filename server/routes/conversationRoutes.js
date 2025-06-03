import express from 'express';
import conversationModel from '../models/conversationModel.js';

const router = express.Router();

//Get all converstion for a user
// conversation/:userId
router.get("/:userId", async(req, res) =>{
    try {
        const conversation = await conversationModel.find({
            participants: req.params.userId
        })
        .populate("participants")
        .populate("lastMessage")
        .sort({updatedAt:-1})

        res.json(conversation)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;