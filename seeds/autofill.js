const mongoose = require('mongoose');
const Campground = require('../models/Campground');
const cities = require('../seeds/cities');
const {descriptors, places} = require('../seeds/names');

mongoose.set('strictQuery', 'false');
var db = mongoose.connect('mongodb://127.0.0.1:27017/yelp2')
    .then(console.log('MongoDB: Auto-filled successfully'))
    .catch(err => console.log('MongoDB: Error while auto-filling', err))

const autoFillMongo = async () => {
    // Wipe the database first
    await Campground.deleteMany({})

    for (let i = 0; i < 25; i++) {
        const rName = array => array[Math.floor(Math.random() * array.length)];
        const rPrice = Math.floor(Math.random() * 100 + 30);
        const rLocation = Math.floor(Math.random() * 500 + 20);

        const autoFillCampground = new Campground({
            name: `${rName(descriptors)} ${rName(places)}`,
            price: rPrice,
            image: 'https://www.alapark.com/sites/default/files/styles/default/public/2019-04/CCC%20Primitive%20camping.jpeg',
            location: `${cities[rLocation].city}, ${cities[rLocation].state}`,
            description: 'Default description for campground. Good place, is there anything to say more?'
        });

        await autoFillCampground.save();
    }
};
autoFillMongo().then(() => mongoose.connection.close());