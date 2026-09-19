import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        const userData = newUser.getPublicProfile();

        res.status(201).json({
            success: true,
            message: "User account successfully registered.",
            userId: newUser._id,
            user: userData,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Email validation
        if (typeof email !== 'string' || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Email must be a string',
            })
        }

        // Password validation
        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Password cannot be empty.',
            })
        }

        const user = await User.login(email, password);

        // Create a token and attach to user
        const token = jwt.sign(
            { userId: user._id },
            config.jwtSecret,
            { expiresIn: '1h' },
        );

        // Attach the token inside the cookie
        res.cookie("token", token, config.cookie);

        // Get public information
        const userData = user.getPublicProfile();

        res.json({
            success: true,
            message: "Logged in successfully",
            user: userData
        });
    } catch (error) {
        next(error);
    }
}