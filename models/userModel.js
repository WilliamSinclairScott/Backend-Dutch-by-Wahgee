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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });