import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

import { add_notif } from "./notif/addNotifController.js";
import { createClient } from 'redis'
import dotenv from "dotenv";
dotenv.config();

// const client = createClient(); //for localhost
const client = createClient( {url: process.env.REDIS_URL});
await client.connect();

const DEFAULT_EXPIRATION = 3600 //setting expiration time for redis cache as one hour

//Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, password, location, occupation, pictureUrl } = req.body; // pictureUrl from frontend

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (location) user.location = location;
    if (occupation) user.occupation = occupation;
    if (pictureUrl) user.picturePath = pictureUrl; // Save new image URL

    await user.save();

    // Send updated user data including profile picture URL
    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        occupation: user.occupation,
        picturePath: user.picturePath, // Updated picture URL
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// export const searchUser = async (req, res) => {
//   try {
//     const name = req.params.name;
//     const user = await User.findOne({ firstName: name })
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// }


export const searchUser = async (req, res) => {
  try {
    const { name } = req.params;
    let query = {};
    
    const cachedUsers = await client.get(name);
    if (cachedUsers) {
      console.log("cache hit!");
      // console.log(cachedUsers);
      return res.status(200).json(JSON.parse(cachedUsers));
    }

    if (name) {
      query = {
        $or: [
          { firstName: { $regex: `^${name}$`, $options: "i" } },
          { lastName: { $regex: `^${name}$`, $options: "i" } },
          { occupation: { $regex: `^${name}$`, $options: "i" } },
          { location: { $regex: `^${name}$`, $options: "i" } },
          { 
            $expr: { 
              $regexMatch: { 
                input: { $concat: ["$firstName", " ", "$lastName"] }, 
                regex: `^${name}$`, 
                options: "i" 
              } 
            } 
          }
        ]
      };
    }
    
    const users = await User.find(query);
    console.log(users);
    await client.setEx(name, DEFAULT_EXPIRATION, JSON.stringify(users));

    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "An error occurred" });
  }
};

export const storeSearch = async (req, res) => {
  //post method

  try {
    const name = req.body.name;
    const id = req.user.id;
    console.log("storing the search of", name);
    const key = `oneworld:user:${id}:searches`;

    //add to existing search if it doesnt exist pehle
    const existingSearch = await client.lRange(key, 0, -1);
    if (!existingSearch.includes(name)) {
        await client.lPush(key, name);
        await client.lTrim(key, 0, 9);
    }

    res.status(200).json({success: true});
  } catch (error) {
    console.log("error in storing the searched name! ", error);
    res.status(500).json({errror: "failed to store searched name"});
  }
}

export const getPastSearches = async (req, res) => {
  //get method

  try {
    const name = req.params.name;
    const id = req.user.id;

    const key = `oneworld:user:${id}:searches`;

    const searches = await client.lRange(key, 0, -1);
    
    const filteredSearches = name
      ? searches.filter((search) =>
          search.toLowerCase().startsWith((name).toLowerCase())
        )
      : searches;

      res.status(200).json(filteredSearches);

  } catch (error) {
    console.log("error in getting past cached searches", error);
    res.status(500).json({error: "failed to get past queries!"});
  }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findById(id);
      const friend = await User.findById(friendId);

      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
          user.friends.push(friendId);
          friend.friends.push(id);
        }
        await user.save();
        await friend.save();
        const friends = await Promise.all(
          user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {
              _id,
              firstName,
              lastName,
              occupation,
              location,
              picturePath,
            };
          }
        );
        
        //notification 

        //user is the one adding or removing a friend and friend is the one being added or removed as a friend
        const field = "friend";

        const user_id = id;
        const user_name = user.firstName; 
        const friend_id = friendId;
        const friend_name = friend.firstName;

        const isAddingFriend = user.friends.includes(friendId); // true if adding, false if removing

        const keyword = !isAddingFriend ? "added to" : "removed from";
        const title1 = `${friend_name} has been ${keyword} your friend list!`;
        const title2 = `You have been ${keyword} ${user_name}'s friend list!`;

        await add_notif(user.email,title1,field);
        await add_notif(friend.email,title2,field);

        //console.log("friend update ",title1);
        
        res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
}