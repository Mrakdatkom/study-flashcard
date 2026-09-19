import { config } from "../config/index.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// A function use to check if a user is authenticated and has token in it
export default async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return next(new AppError('Not authenticated.', 401));
        }

        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(new AppError('No user found with this token.', 401));
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Session expired. Please log in again.', 401));
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again.', 401));
        }

        next(error);
    }
}