import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      default: "/uploads/default_profile_image.png",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
    },
    occupation: {
      type: String,
    },
    viewedProfile: {
      type: Number,
    },
    impressions: {
      type: Number,
    },
    isVerified: { type: Boolean, default: false }, // NEW FIELD
    otp: { type: String }, // Store OTP temporarily
    otpExpires: { type: Date }, // Store OTP expiration time
  },
  { timestamps: true } // timestamps maintains record for when user is created and updated
);

const User = mongoose.model("User", userSchema);
export default User;
