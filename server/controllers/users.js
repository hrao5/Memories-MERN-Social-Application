import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';//store user for a period

import User from '../models/user.js';

export const signin = async (req, res) => {
  // data from frontend comes in req body
  const { email, password } = req.body;
  try {
    // check if the email in database
    const existingUser = await User.findOne({ email })
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    // compare hashed passwords
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // the second argument of the jwt.sign is a secret string
    // the third argument are options
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "7d" });
    res.status(200).json({ result: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Something went wrong. " });
  }
}

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    // we want to check, if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User with this email already exists." });

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

    // hash the password
    // the second parameter is difficulty
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    // this time we take info from results of the creation
    const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

    res.status(200).json({ result: result, token: token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Something went wrong. " });
  }
}