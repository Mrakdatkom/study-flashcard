// Import the models only in the controller; the scheduling utility stays database-free.
import Card from "../models/Card.js";
import Deck from "../models/Deck.js";
import { calculateNextReview } from "../utils/spacedRepetition.js";

// Return every card that the signed-in user is currently due to review.
export async function getDueCards(req, res, next) {
    try {
        // Find only decks owned by the authenticated user.
        const decks = await Deck.find({ userId: req.user._id }).select("_id");

        // Extract the IDs because Card stores a reference to a deck, not directly to a user.
        const deckIds = decks.map((deck) => deck._id);

        // A due card belongs to one of those decks and has a due date at or before right now.
        const cards = await Card.find({
            deckId: { $in: deckIds },
            dueDate: { $lte: new Date() },
        }).sort({ dueDate: 1 });

        res.status(200).json({ success: true, data: cards });
    } catch (error) {
        next(error);
    }
}

// Save a new schedule after the user submits an answer confidence rating.
export async function reviewCard(req, res, next) {
    try {
        // Read the card identity from the URL and the rating from the JSON request body.
        const { cardId } = req.params;
        const { confidenceRating } = req.body;

        // Reject invalid input before attempting any database update.
        if (!Number.isInteger(confidenceRating) || confidenceRating < 0 || confidenceRating > 5) {
            return res.status(400).json({
                success: false,
                message: "confidenceRating must be an integer from 0 to 5.",
            });
        }

        // Limit the card lookup to decks the current user owns.
        const decks = await Deck.find({ userId: req.user._id }).select("_id");
        const deckIds = decks.map((deck) => deck._id);
        const card = await Card.findOne({ _id: cardId, deckId: { $in: deckIds } });

        // Do not reveal whether another user's card exists.
        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found." });
        }

        // Supply the timestamp here so the utility remains a pure function.
        const schedule = calculateNextReview(card.toObject(), confidenceRating, new Date());

        // Persist only the fields calculated by the scheduling utility.
        card.set(schedule);
        await card.save();

        res.status(200).json({
            success: true,
            message: "Review recorded successfully.",
            data: card,
        });
    } catch (error) {
        next(error);
    }
}
