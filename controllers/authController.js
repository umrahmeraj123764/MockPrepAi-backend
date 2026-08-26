import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "enter all details" });
        }

        const userPresent = await User.findOne({ email });
        if (userPresent) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "enter all details" });
        }

        const userPresent = await User.findOne({ email });
        if (!userPresent) {
            return res.status(400).json({ message: "email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, userPresent.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        const token = generateToken(userPresent._id);

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            _id: userPresent._id,
            name: userPresent.name,
            email: userPresent.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};