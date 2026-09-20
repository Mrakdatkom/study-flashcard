import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { createCard, getAllCards } from "../controllers/cardController.js";

const router = Router({ mergeParams: true });
// mergeParams to get the deckId params in the server.js file

router.use(authMiddleware, attachOwnerFilter);

router.post('/', createCard);
router.get('/', getAllCards);

export default router;