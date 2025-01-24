import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'author', 'reader'],
    default: 'reader',
  },
  bio: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  isEmailVerified: {
    type: Boolean,
    default: false, // Default to false until the user verifies their email
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
