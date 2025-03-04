const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    else next();
}




//create route
router.post("/", validateReview, asyncWrap(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//delete route
router.delete("/:review_id", asyncWrap(async (req, res, next) => {
    const { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;