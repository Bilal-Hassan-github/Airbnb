const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    else next();
}


//index route
router.get("/", asyncWrap(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new", (req, res, next) => {
    res.render("listings/new.ejs");
});

//create route
router.post("/", validateListing, asyncWrap(async (req, res, next) => { 
    const newListing = new Listing(req.body.list);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
router.get("/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
}));

//edit route
router.get("/:id/edit", asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const list = await Listing.findOne({ _id: id }); 
    res.render("listings/edit.ejs", { list });
}));

//update route
router.put("/:id", validateListing, asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);//--triger findOneAndDelete middleware
    res.redirect("/listings");
}));

module.exports = router;