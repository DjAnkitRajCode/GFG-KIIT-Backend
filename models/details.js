var mongoose = require('mongoose');

var detailSchema = new mongoose.Schema({
    name: String,
    email: String,
    git : String,
    insta :String,
    twitter :String,
    linkedin :String,
    image: String,
});
module.exports = mongoose.model("Details",detailSchema);