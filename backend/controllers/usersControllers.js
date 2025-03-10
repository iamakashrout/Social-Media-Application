import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

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

export const searchUser = async (req, res) => {
  try {
    const name = req.params.name;
    const user = await User.findOne({ firstName: name })
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
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
        res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
}