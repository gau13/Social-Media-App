import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Register User
export const register = async (req, res) => {
  try {
    // Extract user registration data from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Create a new User instance with the extracted data
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // Assign a random viewedProfile value
      impressions: Math.floor(Math.random() * 10000), // Assign a random impressions value
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a JSON response with the saved user data
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Login User
export const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find a user in the database based on the provided email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Check if the provided password matches the user's password
    const isMatch = user.password === password;

    // If the password does not match, render the "login" view with an error message
    if (!isMatch) {
      return res.render("login", { email, message: "Incorrrect password" });
    }

    // If the email and password are correct, generate a JWT (JSON Web Token)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Remove the password from the user object before sending it in the response
    delete user.password;

    // Send a JSON response with a status code of 200 (OK), the JWT, and the user data
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
