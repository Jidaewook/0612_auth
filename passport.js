const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const {JWT_SECRET} = require('./config');
const userModel = require('./models/user');

//JSON Web Token Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        //Find the user specified in token
        const user = await userModel.findById(payload.sub);

        //If user doesn't exists, handle it
        if(!user){
            return done(null, false);
        }
        //Otherwise, return the user
        done(null, user);

    } catch(error){
        done(error.false);
    }

}));

//Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'

}, async (email, password, done)=> {
    //Find the user given the email
    const user = await userModel.findOne({email});

    //If not, handle it
    if(!user){
        return done(null, false);
    }

}))