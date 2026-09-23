import express from "express";
import { config } from "./config/index.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { connectDb } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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
app.use("/api/decks", deckRoutes);
app.use("/api/decks/:deckId/cards", cardRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorMiddleware);

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`DB connected to ${PORT}`);
    });
});
