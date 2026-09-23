// Create a router dedicated to study-session actions rather than CRUD card actions.
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDueCards, reviewCard } from "../controllers/reviewController.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";

const router = Router();

router.use(authMiddleware, attachOwnerFilter);

// GET /api/reviews/due returns the signed-in user's cards due now or earlier.
router.get("/due", getDueCards);

// PATCH /api/reviews/:cardId accepts { "confidenceRating": 0 } through { "confidenceRating": 5 }.
router.patch("/:cardId", reviewCard);

// Allow server.js to mount these routes under /api/reviews.
export default router;
