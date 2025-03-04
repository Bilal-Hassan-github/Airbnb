const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/1297589252/photo/coming-soon-word-made-from-realistic-gold-isolated-on-white-background-3d-illustration.jpg?s=1024x1024&w=is&k=20&c=cAF67ap59lDA6iI8S3PGrJ1TY4EtArT5vQ_dp9H8OVw=",
        set: (v) => 
            v === ""
                ? "https://media.istockphoto.com/id/1297589252/photo/coming-soon-word-made-from-realistic-gold-isolated-on-white-background-3d-illustration.jpg?s=1024x1024&w=is&k=20&c=cAF67ap59lDA6iI8S3PGrJ1TY4EtArT5vQ_dp9H8OVw="
                : v
    },    
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing.reviews) await Review.deleteMany({ _id: {$in: listing.reviews} });
});


const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;

