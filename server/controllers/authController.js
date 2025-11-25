import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup attempt:", { name, email });
  try {
    // Basic payload validation
    if (!name || !email || !password) {
      console.warn("Signup failed: missing fields", { name, email });
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("Signup failed: email already registered", { email });
      return res.status(400).json({ msg: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("User registered:", { id: newUser._id, email: newUser.email });

    return res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export { signup, login };
