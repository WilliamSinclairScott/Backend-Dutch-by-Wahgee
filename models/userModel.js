import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Pre-save hook to hash password before saving a user document
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

  // Method to compare passwords for login

  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

const User = mongoose.model('User', userSchema);
export default User;
