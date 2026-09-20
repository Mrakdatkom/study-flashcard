import Card from "../models/Card.js";
import Deck from "../models/Deck.js";

export async function createCard(req, res, next) {
    try {
        const { question, answer } = req.body;
        const { deckId } = req.params;

        const deck = await Deck.findOne({
            _id: deckId,
            userId: req.user._id,
        })

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        const card = await Card.create({
            deckId: deck._id,
            question,
            answer
        });

        res.status(201).json({ success: true, message: "Card created successsfully", data: card });
    } catch (error) {
        next(error);
    }
}

export async function getAllCards(req, res, next) {
    try {
        const { deckId } = req.params;

        // Find deck first
        const deck = await Deck.findOne({
            _id: deckId,
            userId: req.user._id,
        });

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        // If deck is present, find the card next under it
        const cards = await Card.find({ deckId: deck._id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: cards });
    } catch (error) {
        next(error);
    }
}

export async function getSingleCard(req, res, next) {
    try {
        const { deckId, cardId } = req.params;

        // Find deck first
        const deck = await Deck.findOne({
            _id: deckId,
            userId: req.user._id,
        })

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        // Find specific card under that deck
        const card = await Card.findOne({ _id: cardId, deckId: deck._id });

        if (!card) {
            res.status(404).json({ success: false, message: "Card not found." });
        }

        res.status(200).json({ success: true, data: card });
    } catch (error) {
        next(error);
    }
}

export async function updateCard(req, res, next) {
    try {
        const { deckId, cardId } = req.params;

        // Find deck first
        const deck = await Deck.findOne({
            _id: deckId,
            userId: req.user._id,
        })

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        const editableFields = ["question", "answer"];
        const updates = Object.fromEntries(
            editableFields.filter((field) => Object.hasOwn(req.body, field)).map((field) => [field, req.body[field]])
        );

        // Check if there's any changes made
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Modify at least one field."
            });
        }

        const updatedCard = await Card.findOneAndUpdate(
            { _id: cardId, deckId: deck._id },
            { $set: updates },
            { returnDocument: "after", runValidators: true },
        );

        if (!updatedCard) {
            return res.status(404).json({ success: false, message: "Card not found." });
        }

        res.status(200).json({ success: true, message: "Card updated successfully.", data: updatedCard });
    } catch (error) {
        next(error);
    }
}

export async function deleteCard(req, res, next) {
    try {
        const { deckId, cardId } = req.params;

        // Find deck first
        const deck = await Deck.findOne({
            _id: deckId,
            userId: req.user._id,
        })

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        const deleteCard = await Card.findOneAndDelete({ _id: cardId, deckId: deck._id });

        if (!deleteCard) {
            return res.status(404).json({ success: false, message: "Card not found." });
        }

        res.status(200).json({ success: true, message: "Card deleted successfully." });
    } catch (error) {
        next(error);
    }
}