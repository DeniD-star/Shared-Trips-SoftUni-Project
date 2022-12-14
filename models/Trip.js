const { Schema, model } = require('mongoose');

const schema = new Schema({

    start: { type: String, minLength: [4, 'Starting Point it has to be at least 4 characters long!'] },
    end: { type: String, minLength: [4, 'End Point it has to be at least 4 characters long!']},
    date: { type: String, required: true},
    time: { type: String, required: true },
    imageCar: { type: String, required:[ true, 'Image is required!'], match: [/^https?/, 'Image must be a valid URL!'] },
    carBrand: { type: String, minLength: [4, 'Car brand cannot be less than 4 characters long!']},
    seats: { type: Number, min: [0, 'Seats is positive number from 0 to 4!'], max: [4, 'Seats is positive number from 0 to 4!']},
    price: { type: Number,min: [1, 'Price is positive number from 1 to 50!'], max: [4, 'Price is positive number from 1 to 50!']},
    description: { type: String, minLength: [10, 'Description cannot be less than 10 characters long!']},
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

})

module.exports = model('Trip', schema);