const mongoose = require('mongoose');

const User = new mongoose.Schema({
     firstname: { type: String, required: true, trim: true },
     lastname: { type: String, required: true, trim: true },
     email: { type: String, required: true, unique: true },
     phone: { type: String, required: true, minlength: 10, maxlength: 15 },
     picture: { type: String, required: false },
     password: { type: String, required: true },
     status: { type: String, default: "active" },
     role: { type: String },
     otp: { type: String, },
     otpExpiry: { type: Date },
     isVerified: { type: Boolean, default: false, },
     verificationToken: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model('user', User);
module.exports = UserModel;