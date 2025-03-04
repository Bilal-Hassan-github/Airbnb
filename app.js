const express = require("express");
const app = express();
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const port = 8080;



main()
    .then((res) => {
        console.log("successful connection")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/skynests');
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.engine("ejs", ejsMate);



app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews)

app.get("/", (req, res) => {
    res.send("root");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});




app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
});