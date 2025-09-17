import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from 'express-async-handler';

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ 
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id) 
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id)
    });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = asyncHandler(async (req, res) => {
  // The user's ID is available from the 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    // Update the user's name and email from the request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Send back the updated user information
    res.status(200).json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});