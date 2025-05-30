import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: false,
        unique: true,
        match: [/^\d{10,}$/, 'Phone number must be at least 10 digits']
    },
    name: {
        type: String,
        required: false
    },
    profileImg: {
        type: String,
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
