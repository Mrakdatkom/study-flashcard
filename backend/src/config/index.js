import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing environment variable/s: ${envVar}`);
        process.exit(1);
    }
})

export const config = {
    mongodbUri: process.env.MONGODB_URI,
    port: parseInt(process.env.PORT, 10) || 5001,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 1000 * 60 * 60,
    },
    redis: {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
}