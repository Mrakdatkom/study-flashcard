import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deck",
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        default: Date.now,
    },
    interval: {
        type: Number,
        default: 0,
        min: 0,
    },
    easeFactor: {
        type: Number,
        default: 2.5,
        min: 1.3,
    },
    repetitions: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });

const Card = mongoose.model("Card", cardSchema);

export default Card;
