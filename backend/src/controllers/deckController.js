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

export async function getAllDecks(req, res, next) {
    try {
        const deck = await Deck.find({ ...req.ownerFilter }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: deck });
    } catch (error) {
        next(error);
    }
}

export async function getSingleDeck(req, res, next) {
    try {
        const deck = await Deck.findOne({ _id: req.params.id, ...req.ownerFilter });

        if (!deck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        return res.status(200).json({ success: true, data: deck });
    } catch (error) {
        next(error);
    }
}

export async function updateDeck(req, res, next) {
    try {
        const editableFields = ["title", "description"];
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

        const updatedDeck = await Deck.findOneAndUpdate(
            { _id: req.params.id, ...req.ownerFilter },
            { $set: updates },
            { returnDocument: "after", runValidators: true },
        );

        if (!updatedDeck) {
            return res.status(404).json({ success: false, message: "Deck not found." });
        }

        res.status(200).json({ success: true, message: "Deck updated successfully", data: updatedDeck });
    } catch (error) {
        next(error);
    }
}