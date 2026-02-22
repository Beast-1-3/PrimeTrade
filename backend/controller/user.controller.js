import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../jwt/token.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 60 * 60 * 1000 // 1 hour
};

export const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, username, email, password: hashPassword });
        const savedUser = await user.save();
        if (savedUser) {
            const token = generateToken(savedUser);
            res.status(201).cookie("token", token, cookieOptions).json({
                message: `User sign up successful`,
                savedUser
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Error in sign-up`
        });
    }
}

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.status(200).cookie("token", token, cookieOptions).json({
            message: "Login successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in sign-in"
        });
    }
}

export const logout = (req, res) => {
    res.status(200).clearCookie("token").json({
        message: "Logout successful"
    });
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { firstName, lastName, username, email } = req.body;

        // Check if email is taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            { ...(firstName && { firstName }), ...(lastName && { lastName }), ...(username && { username }), ...(email && { email }) },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
}