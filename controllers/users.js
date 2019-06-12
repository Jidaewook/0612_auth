const userModel = require('../models/user');


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
                res.status(200).json({user: 'created'});
            })
            .catch(err => console.log(err));

        //
    }, 
    signIn: async (req, res, next) => {
        console.log('signIn()');
    },
    secret: async (req, res, next) => {
        console.log('secret()');
    }
};