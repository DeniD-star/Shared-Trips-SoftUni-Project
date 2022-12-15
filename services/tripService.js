const Trip = require('../models/Trip');
const User = require('../models/User');


async function getAllTrips(){
    return Trip.find({}).lean();
}
async function offerTrip(tripData){
    const trip = await new Trip(tripData);
    trip.save();
    return trip;
}

async function getTripById(id){
    return Trip.findById(id).populate('buddies').lean();
}
async function editTrip(id, newTrip){
    const trip = await Trip.findById(id);
    trip.start = newTrip.start.trim()
    trip.end = newTrip.end.trim()
    trip.date = newTrip.date.trim()
    trip.time = newTrip.time.trim()
    trip.imageCar = newTrip.imageCar.trim()
    trip.carBrand = newTrip.carBrand.trim()
    trip.seats = Number(newTrip.seats)
    trip.price = Number(newTrip.price)
    trip.description = newTrip.description.trim()

    await trip.save()
    return trip;
}

async function deleteTrip(id){
    return Trip.findByIdAndDelete(id);
}

async function joinTrip(tripId, userId){
        const trip = await Trip.findById(tripId)
        const user = await User.findById(userId)
  
        if(trip.seats != 0){
            trip.buddies.push(user);
            trip.seats--;
            
        }
        
       return Promise.all([trip.save(), user.save()])

}
module.exports = {
    getAllTrips,
    offerTrip,
    getTripById,
    editTrip,
    deleteTrip,
    joinTrip
}