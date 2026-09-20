import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { createDeck, getAllDecks, getSingleDeck, updateDeck } from "../controllers/deckController.js";

const router = Router();

router.use(authMiddleware, attachOwnerFilter);

router.post('/', createDeck);
router.get('/', getAllDecks);
router.get('/:id', getSingleDeck);
router.put('/:id', updateDeck);

export default router;