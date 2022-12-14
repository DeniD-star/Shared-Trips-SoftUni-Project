const {Schema, model} = require('mongoose');

const schema = new Schema({
   
    email:{type: String, required: true},
    gender:{type: String, required: true, enum: [['male', 'female'], 'Indicate your gender is necessary!']},
    hashedPassword: {type: String, required: true},
    historyTrips: [{type: Schema.Types.ObjectId, ref: 'Trip', default: []}]
})

module.exports = model('User', schema);