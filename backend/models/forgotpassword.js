import mongoose from "mongoose";

const pass_reset = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim : true
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  });

export default mongoose.model("Pw_Reset", pass_reset);