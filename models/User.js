const {Schema, model} = require('mongoose');

const schema = new Schema({
   
    email:{type: String, required: true},
    gender:{type: String, enum: ['female', 'male']},
    hashedPassword: {type: String, required: true},
    historyTrips: [{type: Schema.Types.ObjectId, ref: 'Trip', default: []}]
})

module.exports = model('User', schema);