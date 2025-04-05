import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        opId: {
            type: String,
            // required: true
        }, //will search current stories of friends through their id's
        storyPath: {
            type: String,
            default: "/uploads/default_profile_image.png",
        },
        caption: {
            type: String,
            default: ""
        },
        views: {
            type: Array,
            default: []
        },
        viewcount: {
            type: Number,
        },
        likes: {
            type: Array,
            default: []
        },
        likecount: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 86400 //to delete it automatically after 24 hours
        }
    }, {timestamps: true}
)

const Story = mongoose.model("Story", storySchema);
export default Story