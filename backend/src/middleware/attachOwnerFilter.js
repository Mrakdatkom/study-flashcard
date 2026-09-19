// backend/src/middleware/attachOwnerFilter.js
export default function attachOwnerFilter(req, res, next) {
    req.ownerFilter = { userId: req.user._id };
    // Usage: req.ownerFilter
    next();
}