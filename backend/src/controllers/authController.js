import User from "../models/User.js";

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