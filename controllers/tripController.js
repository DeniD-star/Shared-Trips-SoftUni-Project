const { isUser } = require('../middlewares/guards');
const {parseError }= require('../util/parse')
const router = require('express').Router();
const userService = require('../services/userService')


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
            creatorEmail: req.user.email,
            buddies: [],
        }
        await req.storage.offerTrip(tripData, req.user._id)
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
        trip.isCreator = req.user && req.user._id == trip.creator;
        trip.joined = req.user && trip.buddies.find(x=> x._id == req.user._id)
        trip.availableSeats = trip.seats && trip.seats > 0; 
        trip.emails = trip.buddies.map(x=> x.email);
        trip.buddyEmails= trip.emails.join(', ')
       

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
  
      const trip = await req.storage.getTripById(req.params.id);

     
      res.render('trip-edit', {trip})
   
})
router.post('/edit/:id', isUser(), async(req, res)=>{
    try {
      const trip = await req.storage.getTripById(req.params.id);


      if(trip.creator != req.user._id){
        
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


router.get('/delete/:id', isUser(), async(req, res)=>{
        try {
            const trip = await req.storage.getTripById(req.params.id);


            if(trip.creator != req.user._id){
              
                throw new Error('You cannot delete a trip you have not created!')
            }

            await req.storage.deleteTrip(req.params.id);
            res.redirect('/trips/catalog')
        } catch (err) {
            console.log(err.message);
            res.redirect('/trips/404')
        }
})


router.get('/join/:id', isUser(), async(req, res)=>{
    try {
        const trip = await req.storage.getTripById(req.params.id);
        if(trip.creator == req.user._id){
            throw new Error('You cannot join a trip you have created!')
        }

        await req.storage.joinTrip(req.params.id, req.user._id);
        res.redirect('/trips/details/' + req.params.id)
    } catch (err) {
        console.log(err.message);
        res.redirect('/trips/404')
    }
})


// router.get('/profile', isUser(), async(req, res) =>{
//     try {

        
       
//             const user = await userService.getUserByEmail(req.user.email)
//             user.userEmail = user.email;
//             user.length = user.historyTrips.length;
//             user.history = user.historyTrips.map((x)=> req.storage.getTripById(x));
//             console.log(user.history  + '      history');

//             console.log(user + '        user');
//         // if(user != req.user._id){
//         //     throw new Error('You cannot have access to another profile!')
//         // }
    
//         await req.storage.getUserTrips(req.user._id)
//         res.render('profile', {user})
        
       
        
//     } catch (err) {
//         console.log(err.message);
//         res.redirect('/trips/404')
//     }
// })


router.get('/profile', async(req, res)=>{
    const user = await req.storage.getUsersAllTrips(req.user._id);
   //console.log(req.user.gender , 'tripController')

    res.render('profile', {user});
});

module.exports = router;