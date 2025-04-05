import User from "../models/userModel.js";
import Story from "../models/storyModel.js";
import dotenv from "dotenv";
dotenv.config();

export const createStory = async (req, res) => {
    console.log("hi hi hi hi");
    try {
        const id = req.user.id;

        //get image and caption from frontend
        console.log(req.body);
        const { storyPath, caption } = req.body;

        const originalPoster = await User.findById(id);
        // const originalPoster = await User.findOne({email: email});
        const { firstName, lastName } = originalPoster;
        // const id = originalPoster._id;
        
        console.log("everythings fine till here");

        const newStory = new Story({
            firstName,
            lastName,
            opId: id,
            storyPath,
            caption,
            views: [],
            viewcount: 0,
            likes: [],
            likecount: 0,
        });

        console.log("hi there");

        const savedStory = await newStory.save();
        console.log("bruh moment");
        res.status(200).json(savedStory);

    } catch (error) {
        console.log("error while creating a story!", error);
        res.status(500).json({message: "there are been an error!", error});
    }
}

export const fetchStories = async (req, res) => {
    try {
        const id = req.user.id;
        const viewer = await User.findById(id);
        const allStories = await Story.find({ opId: { $in: viewer.friends } });

        res.status(200).json(allStories);

    } catch (error) {
        console.log("error while fetching stories!", error);
        res.status(500).json({message: "there has been an error!", error});
    }
}

export const viewStory = async (req, res) => {
    try {
        //increase view count if hasn't seen the story before!
        const id = req.user.id;

        const {storyId} = req.body;
        const story = await Story.findById(storyId);

        //find if id is in view array
        let found = false;
        console.log("console dot logging the damn id", id);
        if (story.views) {
            for (let viewerId of story.views) {
                if (viewerId == id) {
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            story.views.push(id);
            story.viewcount = story.viewcount + 1;
            const updatedStory = await story.save();
            return res.status(200).json({updatedStory});
        }
        return res.status(200).json({story});

    } catch (error) {
        console.log("error while viewing a story!", error);
        res.status(500).json({message: "there has been an error!", error});
    }
}

export const likeStory = async (req, res) => {

    try {
        const id = req.user.id;
        const storyId = req.body.storyId;
        
        const story = await Story.findById(storyId);
        
        let found = false;
        for (let liked of story.likes) {
            if (liked == id) {
                //remove like
                found = true;
                const changeUser = await Story.updateOne(
                {
                    _id: storyId
                },
                { 
                    $pull: { likes: id },
                    $inc: { likecount: -1 } 
                }
            )}
            break;
        }

        if (!found) {
            story.likes.push(id);
            story.likecount = story.likecount + 1;
            story.save();
        }

        res.status(200).json({found});
    } catch (error) {
        console.log("error while liking a story!", error);
        res.status(500).json({error});
    }
}

export const getOwnStories = async (req, res) => {
    try {
        const id = req.user.id;
        const stories = await Story.find({opId: id});

        return res.status(200).json({stories});
    } catch (error) {
        console.log("error in getting own stories");
        res.status(500).json({error});
    }
}

