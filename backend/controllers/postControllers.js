import Post from "../models/postModel.js";
import User from "../models/userModel.js";

import { add_notif } from "./notif/addNotifController.js";
import {postNotif} from "./notif/postNotifsControllers.js";

/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const { userId, description, category, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      category,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    console.log('firstName: ', user.firstName);
    //notification
    const title = `${user.firstName} posted something!`;
    await postNotif(user.email,title,"post");

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


/* READ POST */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* UPDATE POSTS */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        //notification 
        const postCreator = await User.findById(post.userId);
        const user = await User.findById(userId);
        const name = user.firstName;  
        const title = `${name} liked your post!`;
        const field = "like_post";
        const postOwner = postCreator.email;

        if(!isLiked){
            await add_notif(postOwner,title,field);
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; 

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    
    if (post.userId.toString() !== userId) {
     
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userpic, username, comment } = req.body;
    const newComment = {userId, userpic, username, comment };
    const post = await Post.findById(id);
    post.comments.push(newComment);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

      //notification 
     const postCreator = await User.findById(post.userId);
     const user = await User.findById(userId);
     const name = user.firstName;  
     const title = `${name} commented on your post!`;
     const field = "comment";
     const postOwner = postCreator.email;
     console.log("id inside comment func ",postOwnerId);
     await add_notif(postOwner,title,field);

     res.status(200).json(updatedPost);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the comment belongs to the logged-in user
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }


    post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { newComment } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
   
    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
   
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    // Update the comment
    comment.comment = newComment;

    // Save the updated post
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeComment = async (req, res) => {
  try {
      const { id,commentId } = req.params; // Post ID
      const userId = req.user.id;
      
      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.find(c => c._id.toString() === commentId);
      if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
      }
      
      if (!comment.likes) {
          comment.likes = new Map();
      }

      const isLiked = comment.likes.get(userId);
      if (isLiked) {
          comment.likes.delete(userId);
      } else {
          comment.likes.set(userId, true);
      }

      await post.save();

      //notification 
      const commentCreator = await User.findById(comment.userId);
      const user = await User.findById(userId);
      const name = user.firstName;  
      const title = `${name} liked your comment!`;
      const field = "like_comment";
      const commentOwner = commentCreator.email;
      if(!isLiked)
          await add_notif(commentOwner,title,field);

      res.status(200).json(post);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};


