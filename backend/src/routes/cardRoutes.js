import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { createCard, deleteCard, getAllCards, getSingleCard, updateCard } from "../controllers/cardController.js";

const router = Router({ mergeParams: true });
// mergeParams to get the deckId params in the server.js file

router.use(authMiddleware, attachOwnerFilter);

router.post('/', createCard);
router.get('/', getAllCards);
router.get('/:cardId', getSingleCard);
router.put('/:cardId', updateCard);
router.delete('/:cardId', deleteCard);

export default router;