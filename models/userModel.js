import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    divvys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Divvy'
    }]
});