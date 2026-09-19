import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { createDeck, getAllDecks } from "../controllers/deckController.js";

const router = Router();

router.use(authMiddleware, attachOwnerFilter);

router.post('/', createDeck);
router.get('/', getAllDecks);

export default router;