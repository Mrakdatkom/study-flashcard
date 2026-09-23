// The smallest permitted ease factor prevents intervals from shrinking forever.
const MINIMUM_EASE_FACTOR = 1.3;

// Calculate a new schedule without changing the supplied card or saving anything.
// `reviewedAt` is an argument so this function stays deterministic and easy to test.
export function calculateNextReview(card, userConfidenceRating, reviewedAt) {
    // A rating from 0 to 2 means the learner did not recall the card reliably.
    if (!Number.isInteger(userConfidenceRating) || userConfidenceRating < 0 || userConfidenceRating > 5) {
        throw new RangeError("Confidence rating must be an integer from 0 to 5.");
    }

    // Convert the supplied timestamp to a Date without mutating the caller's value.
    const reviewDate = new Date(reviewedAt);

    // Stop before creating an invalid due date when the controller passes a bad timestamp.
    if (Number.isNaN(reviewDate.getTime())) {
        throw new TypeError("reviewedAt must be a valid date.");
    }

    // Use the card's defaults when scheduling older cards that do not yet have these fields.
    const currentEaseFactor = card.easeFactor ?? 2.5;
    const currentInterval = card.interval ?? 0;
    const currentRepetitions = card.repetitions ?? 0;

    // SM-2's ease adjustment gives high-confidence answers a small boost and low ones a penalty.
    const ratingDistanceFromFive = 5 - userConfidenceRating;
    const easeChange = 0.1 - ratingDistanceFromFive * (0.08 + ratingDistanceFromFive * 0.02);
    const easeFactor = Math.max(MINIMUM_EASE_FACTOR, currentEaseFactor + easeChange);

    // A failed recall restarts the learning sequence and shows the card again tomorrow.
    if (userConfidenceRating < 3) {
        const interval = 1;
        const repetitions = 0;
        const dueDate = new Date(reviewDate);
        dueDate.setUTCDate(dueDate.getUTCDate() + interval);

        return { dueDate, interval, easeFactor, repetitions };
    }

    // A successful recall advances the card through its first two fixed intervals.
    const repetitions = currentRepetitions + 1;
    let interval;

    if (repetitions === 1) {
        interval = 1;
    } else if (repetitions === 2) {
        interval = 6;
    } else {
        // Later successful reviews multiply the previous interval by the new ease factor.
        interval = Math.max(1, Math.round(currentInterval * easeFactor));
    }

    // Schedule relative to the actual review time, not the old (possibly overdue) due date.
    const dueDate = new Date(reviewDate);
    dueDate.setUTCDate(dueDate.getUTCDate() + interval);

    // Return plain values; the controller decides how and when to persist them.
    return { dueDate, interval, easeFactor, repetitions };
}
