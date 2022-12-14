const { isUser } = require('../middlewares/guards');
const parseError = require('../util/parse')
const router = require('express').Router();


router.get('/', (req, res) => {
    res.render('home')
})
router.get('/catalog', async (req, res) => {
    const trips = await req.storage.getAllTrips()
    res.render('shared-trips', { trips })
})
router.get('/create', isUser(), async (req, res) => {
    res.render('trip-create')
})
router.post('/create', isUser(), async (req, res) => {
    try {

        const tripData = {
            start: req.body.start,
            end: req.body.end,
            date: req.body.date,
            time: req.body.time,
            imageCar: req.body.imageCar,
            carBrand: req.body.carBrand,
            seats: Number(req.body.seats),
            price: Number(req.body.price),
            description: req.body.description,
            creator: req.user._id,
            buddies: [],
        }
        await req.storage.offerTrip(tripData)
        res.redirect('/trips/catalog')
    } catch (err) {
        console.log(err.message);
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errors = [err.message]
        }

        const ctx = {
            errors,
            tripData: {
                start: req.body.start,
                end: req.body.end,
                date: req.body.date,
                time: req.body.time,
                imageCar: req.body.imageCar,
                carBrand: req.body.carBrand,
                seats: req.body.seats,
                price: req.body.price,
                description: req.body.description,
            }
        }
        res.render('trip-create', ctx)
    }


})

router.get('/details/:id', async(req, res)=>{
    try {

        const trip = await req.storage.getTripById(req.params.id);
        trip.hasUser = Boolean(req.user);
        trip.isCreator = req.user && req.user._id == trip.creator

        res.render('trip-details', {trip})
    } catch (err) {
        console.log(err.message);
        res.redirect('/trips/404')
    }
})

router.get('/404', (req, res)=>{
    res.render('404')
})
router.get('/edit/:id', isUser(), async(req, res)=>{
    try {
      const trip = await req.storage.getTripById(req.params.id);

      if(trip.creator !== req.user._id){
          throw new Error('You cannot edit a trip you have not created!')
      }

      res.render('trip-edit', {trip})
    } catch (err) {
        console.log(err.message);
        res.redirect('/trips/catalog')
    }
})
router.post('/edit/:id', isUser(), async(req, res)=>{
    try {
      const trip = await req.storage.getTripById(req.params.id);

      if(trip.creator !== req.user._id){
          
          throw new Error('You cannot edit a trip you have not created!')
      }

      
        await req.storage.editTrip(req.params.id, req.body)
      res.redirect('/trips/catalog')
    } catch (err) {
        console.log(err.message);

        const ctx = {
            errors: parseError(err),
          trip: {
                _id: req.params.id,
                start: req.body.start,
                end: req.body.end,
                date: req.body.date,
                time: req.body.time,
                imageCar: req.body.imageCar,
                carBrand: req.body.carBrand,
                seats:Number( req.body.seats),
                price: Number(req.body.price),
                description: req.body.description,
            }
        }
        res.render('trip-edit', ctx)
    }
})
module.exports = router;