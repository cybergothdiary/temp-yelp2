const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    name: {
        type: String, required: true
    },
    price: {
        type: Number, required: true, min: 0, max: 1000
    },
    image: {
        type: String, required: true
    },
    location: {
        type: String, required: true
    },
    description: {
        type: String, default: 'No description yet ;|'
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;