import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDb = async () => {
    try {
        await mongoose.connect(config.mongodbUri, {
            sanitizeFilter: true,
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connection to database", error);
        process.exit(1);
    }
}