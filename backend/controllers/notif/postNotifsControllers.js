import User from "../../models/userModel.js";
import { add_notif } from "./addNotifController.js";

export const postNotif = async (userEmail,title,field) => {
try{
    const user = await User.findOne({email: userEmail});

    // Get all friends' details
    const friends = await Promise.all(
        user.friends.map(async (friendId) => {
            const friend = await User.findById(friendId);
            const id = friend.userId;
            add_notif(friend.email,title,field);
        })
    );
}
catch (error) {
        console.error("Error adding notification:", error);
}

}
