const Trip = require('../models/Trip');


async function getAllTrips(){
    return Trip.find({}).lean();
}
async function offerTrip(tripData){
    const trip = await new Trip(tripData);
    trip.save();
    return trip;
}

async function getTripById(id){
    return Trip.findById(id).lean();
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
module.exports = {
    getAllTrips,
    offerTrip,
    getTripById,
    editTrip,
    deleteTrip
}