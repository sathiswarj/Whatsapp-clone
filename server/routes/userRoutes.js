import express from 'express';
import User from '../models/userModel.js'; 
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload  = multer({ storage })
// Get user by phone number
router.get('/:phone', async (req, res) => {
    try {
        const { phone } = req.params;

        const user = await User.findOne({ phone });
        const profileImg = user.profileImg ? `${req.protocol}://${req.get('host')}${user.profileImg}`: null;


        if (user) {
            return res.status(200).json({
                message: 'User found',
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    profileImg: profileImg
                }
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/', upload.single('profile'), async (req, res) => {
    try {
        const { phone, name } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (req.file && !req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Only image uploads are allowed' });
        }

        const profileImg = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Profile image saved at:", profileImg);

        const newUser = new User({
            phone,
            name,
            profileImg
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user by id

router.put('/:id', upload.single('profile'), async (req, res) => {
    const { name, phone } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         if (req.file) {
            if (user.profileImg) {
                const oldPath = `.${user.profileImg}`;
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            user.profileImg = `/uploads/${req.file.filename}`;
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();
        return res.status(200).json({ message: 'User updated successfully', user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;
