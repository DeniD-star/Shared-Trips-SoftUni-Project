const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const tripController = require('../controllers/tripController');


module.exports=(app)=>{
    app.use('/auth', authController)
    app.use('/', homeController)
    app.use('/trips', tripController)
}