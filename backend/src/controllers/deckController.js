import Deck from "../models/Deck.js";

export async function createDeck(req, res, next) {
    try {
        const { title, description } = req.body;

        const newDeck = new Deck({
            userId: req.user._id,
            title,
            description
        });

        const deck = await newDeck.save();

        res.status(201).json({ success: true, message: "Deck created successfully.", data: deck });
    } catch (error) {
        next(error);
    }
}
