import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    category: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        userId: {
          type: String,
          required: true
        },
        userpic: {
          type: String,
        },
        username: {
          type: String,
          required: true
        },
        comment: {
          type: String,
          required: true
        },
        likes: {
          type: Map,  
          of: Boolean, 
          default: {}
        }
      }
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;