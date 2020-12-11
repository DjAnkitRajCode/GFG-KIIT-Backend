var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    title: String,
    text: String,
    image: String,
});
module.exports = mongoose.model("Events",eventSchema);