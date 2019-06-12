const userModel = require('../models/user');
const JWT = require('jsonwebtoken');

const {JWT_SECRET} = require('../config');

signToken = user => {
    return JWT.sign({
        iss: 'JayDEE',
        sub: user._id,
        iat: new Date().getTime(), //current Time
        exp: new Date().setDate(new Date().getDate() + 1) //current Time + 1 day ahead

    }, JWT_SECRET);
}

module.exports = {
    signUp: async(req, res, next) => {
        // console.log('contents of req.value.body', req.value.body);
        const {email, password} = req.value.body;

        //Check if there is a user with the same email
        const foundUser = await userModel.findOne({email});
        if(foundUser){
            return res.status(403).json({error: 'Email is already in use'});
        }

        //Else Create new user 
        const newUser = new userModel({email, password});
        await newUser
            .save()

            .then(result => {
                const token = signToken(newUser);
                res.status(200).json({user: token});
            })
            .catch(err => {
                res.status(404).json({
                    msg: err
                });
            });

        //
    }, 
    signIn: async (req, res, next) => {
        console.log('signIn()');
    },
    secret: async (req, res, next) => {
        res.status(200).json({
            msg: "secret"
        });
    }
};