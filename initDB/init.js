const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then((res) => {
        console.log("successful connection")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/skynests');
}

const initDB = async () => {
    await Listing.deleteMany({}); 
    await Listing.insertMany(initData.data);
}

initDB()
    .then((res) => {
        console.log("DB skynests is initialized");
    })
    .catch(err => console.log(err));
