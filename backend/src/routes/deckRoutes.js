import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { createDeck, deleteDeck, getAllDecks, getSingleDeck, updateDeck } from "../controllers/deckController.js";

const router = Router();

router.use(authMiddleware, attachOwnerFilter);

router.post('/', createDeck);
router.get('/', getAllDecks);
router.get('/:id', getSingleDeck);
router.put('/:id', updateDeck);
router.delete('/:id', deleteDeck);

export default router;