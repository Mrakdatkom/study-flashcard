import express from "express";
import { config } from "./config/index.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { connectDb } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = config.port;

app.use(helmet());

app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

// Ratelimiter

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`DB connected to ${PORT}`);
    });
});