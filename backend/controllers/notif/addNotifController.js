import Notif from "../../models/notifsModel.js";
import User from "../../models/userModel.js";
import Post from "../../models/postModel.js";
import mongoose from "mongoose";

export const add_notif = async (userEmail, title, field) => {
    try {
        
        console.log("add_notif called with: ", userEmail, title, field); 
        const newNotification = {
            title,
            field
        };
        const user = await Notif.findOneAndUpdate(
            { userEmail},
            {
                $push: { notifications: newNotification },
            },
            {  new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log("Notification added successfully: ",user);
    } catch (error) {
        console.error("Error adding notification:", error);
    }
}; 


export const fetch = async (req, res) => {
    try {
       // console.log("req body ",req.body)
        //const { _id } = req.body;
        const {userEmail} = req.params;
    //    console.log("id : ",new mongoose.Types.ObjectId(_id));
        console.log(userEmail);
        const user = await User.findOne({email: userEmail});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user_notifications = await Notif.findOne({ userEmail });
        console.log(user_notifications);

        if (!user_notifications) {
            return res.status(200).json([]);
        }

        //console.log("notifications : ",user_notifications.notifications);
        const reversedNotifications = user_notifications.notifications.reverse();
        res.status(200).json(reversedNotifications);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

export const markSeen = async (req, res) => {
    try {
        //const { userId, notifId } = req.body;  
        const { userEmail, notifId } = req.params; 

        // Ensure user exists
        const user = await User.findOne({email: userEmail});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure notifId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(notifId)) {
            return res.status(400).json({ error: "Invalid notifId" });
        }

        // Find and update the notification
        const updatedNotif = await Notif.findOneAndUpdate(
            { userEmail, 'notifications._id': new mongoose.Types.ObjectId(notifId) },
            { $set: { 'notifications.$.seen': true } },
            { new: true }
        );

        console.log("Updated Notification:", updatedNotif);

        if (!updatedNotif) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as seen", updatedNotif });
    } catch (error) {
        console.error("Error in markSeen:", error);
        res.status(500).json({ error: "Error updating notification", details: error.message });
    }
};


export const deleteNotif = async (req, res) => {
    try {
        //const {userId} = req.body;
        const {userEmail, notifId} = req.params;

        const user = await User.findOne({email: userEmail});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // const result = await Notif.updateOne(
        //     { userEmail },
        //     { $pull: { notifications: { seen: true } } }
        // );

        const updatedUser = await Notif.findOneAndUpdate(
            { userEmail },
            { $pull: { notifications: { _id: new mongoose.Types.ObjectId(notifId) } } },
            { new: true }
        );

        // if (result.nModified === 0) {
        //     return res.status(404).json({ error: 'No notifications found to delete' });
        // }

        // res.status(200).json({ message: 'Notifications deleted successfully', result });

        if (!updatedUser) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully", updatedUser });
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        res.status(500).json({ error: "Error deleting notification", details: error.message });
    }
};

//for postman testing
export const addNotif = async (req, res) => {
    console.log("Incoming request body:", req.body); 
    const { userEmail, title, field} = req.body;

    if (!userEmail || !title || !field) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await add_notif(userEmail, title, field);
        res.status(200).json({ message: 'Notification added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating notification', error });
    }
};