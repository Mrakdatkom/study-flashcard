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