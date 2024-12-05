import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user has been registered.
 */
export const register = async (req, res) => {
  try {
    // Generate a salt and hash the password.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create a new user.
    const doc = new UserModel({
      username: req.body.username,
      password: hash,
    });

    // Save the user to the database.
    const user = await doc.save();

    // Generate a JWT token for the user.
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    // Return the user data and the token.
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);

    // Return an error message if the user already exists.
    res.json({ message: "User Already Exists" });
  }
};

/**
 * Logs in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user has been logged in.
 */
export const login = async (req, res) => {
  try {
    // Find the user by the username.
    const user = await UserModel.findOne({ username: req.body.username });

    // If the user is not found, return an error message.
    if (!user) {
      return res.status(405).json({ message: "User Not Found" });
    }

    // Compare the password provided by the user with the password in the database.
    const isValidPass = await bcrypt.compare(req.body.password, user.password);

    // If the passwords do not match, return an error message.
    if (!isValidPass) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate a JWT token for the user.
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    // Return the user data and the token.
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    // Return an error message if an error occurs during the login process.
    res.json({ message: "User Not Found" });
  }
};

/**
 * Returns the user data associated with the provided user ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user data has been sent.
 */
export const getMe = async (req, res) => {
  try {
    // Find the user document in the database by the provided user ID.
    const user = await UserModel.findById(req.userId);

    // If the user is not found, return an error message.
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Return the user data without the password hash.
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    // Handle any errors that occur during the process.
    console.log(error);
  }
};
