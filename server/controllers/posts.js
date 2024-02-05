import Post from "../models/Post.js";
import User from "../models/User.js";

//Create
export const createPost = async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, description, picturePath } = req.body;

    // Find the user in the database based on userId
    const user = await User.findById(userId);

    // Create a new post object with user information and other details
    const newPost = {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description,
      userPicurePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    };

    // Save the new post to the database
    // await newPost.save();

    const postInstance = new Post(newPost);
    await postInstance.save();

    // Fetch all posts from the database
    const post = await Post.find();

    // Send a JSON response with the array of posts
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//Read
export const getFeedPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const post = await Post.find();

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    // Extract userId from the request parameters
    const { userId } = req.params;

    // Fetch all posts from the database that belong to the specified userId
    const post = await Post.find({ userId });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update
export const likePost = async (req, res) => {
  try {
    // Extract parameters and body from the request
    const { id } = req.params;
    const { userId } = req.body;

    // Fetch the post by ID
    const post = await Post.findById(id);

    // Check if the user has already liked the post
    const isLiked = post.likes.get(userId);

    // Update the likes based on the existing like status
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // Update the post in the database
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    // Send a JSON response with the updated post
    res.status(200).json(updatedPost);
  } catch (err) {
    // Handle errors by sending a JSON response with an error message
    res.status(404).json({ message: err.message });
  }
};
