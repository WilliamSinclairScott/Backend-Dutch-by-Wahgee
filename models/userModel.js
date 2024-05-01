import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    password: {
    type: String,
    required: true
    },
    displayName: {
        type: String,
        required: true
    },
    Divvys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Divvy'
    }]
});

const User = mongoose.model('User', userSchema);
export default User;
