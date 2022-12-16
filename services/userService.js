const User = require('../models/User');

async function createUser(email, gender, hashedPassword) {
    const user = new User({
        email,
        gender,
        hashedPassword,
        historyTrips: []
    })

    await user.save();
    console.log(user);
    return user;
}


async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i')
    const user = await User.findOne({ email: { $regex: pattern } });
    return user;
}

module.exports = {
    createUser,
    getUserByEmail
}