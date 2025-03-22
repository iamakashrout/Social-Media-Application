import mongoose from "mongoose";

const notifSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true},
    field:{
      type:String,
      required:true,
      enum: ['like_post' ,'like_comment' , 'comment' , 'post' , 'friend'] ,
    },
    seen: {
        type: Boolean,
        default: false }, 
    createdAt: {
        type: Date,
        default: Date.now },
});

const notifS = mongoose.Schema({
  userEmail:{
    type: String, 
    required: true,
    unique:true},
  notifications: {
    type: [notifSchema],
    default: [],
  },
});

const Notif = mongoose.model("Notif", notifS);
export default Notif;