import User from "../models/User.js";

//---------------Read

export const getUser = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { id } = req.params;

    // Find a user in the database based on the provided ID
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { id } = req.params;

    // Find the user in the database based on the provided ID
    const user = await User.findById(id);

    // Fetch the friends of the user by querying the database for each friend's ID
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // Format the friends' data to include only specific fields
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    // Send a JSON response with the formatted friends' data
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//-----------Add or Remove Friend

export const addRemoveFriend = async (req, res) => {
  try {
    // Extract user ID and friend ID from the request parameters
    const { id, friendId } = req.params;

    // Find the user and friend in the database based on their IDs
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // Check if the friend is already in the user's friends list
    if (user.friends.includes(friendId)) {
      // If the friend is already in the list, remove them
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = user.friends.filter((id) => id !== id);
    } else {
      // If the friend is not in the list, add them
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    // Save the updated user and friend data to the database
    await user.save();
    await friend.save();

    // Fetch the updated list of friends for the user
    const updatedFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // Format the friends' data to include only specific fields
    const formattedFriends = updatedFriends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    // Send a JSON response with the formatted friends' data
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
