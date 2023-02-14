const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./catchAsync');
const ExpressError = require('./ExpressError');
const Joi = require('joi');
const app = express();

const Campground = require('./models/Campground');

mongoose.set('strictQuery', 'false');
mongoose.connect('mongodb://127.0.0.1:27017/yelp2')
    .then(console.log('MongoDB: Connected successfully'))
    .catch(err => console.log('MongoDB: Error', err))

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/', (req, res) => {
    res.redirect('/campgrounds');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

app.post('/campgrounds', catchAsync(async (req, res) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new ExpressError(message, 400);
    }

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/add', (req, res) => {
    res.render('campgrounds/add');
})

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/campground-page', {campground});
}));

app.get('/campgrounds/:id/update', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/update', {campground});
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {runValidators: true});
    console.log(req.body);
    res.redirect(`/campgrounds/${req.params.id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
    // res.status(404).send('404: Sorry, not found!')
    next(new ExpressError('Sorry, not found!', 404));
});

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500
    if (!err.message) err.message = 'O-o-ps, something went wrong'
    // console.dir(err);
    res.status(err.status).render('error', {err});
})

app.listen(3000, () => {
    console.log('Server is running on localhost ;)')
})