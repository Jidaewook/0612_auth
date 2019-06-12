const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const userModel = require('./models/user');



//JSON Web Token Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
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
    
    try{
        //Find the user given the email
        const user = await userModel.findOne({"local.email": email});

        //If not, handle it
        if(!user){
            return done(null, false);
        }

        //Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        //If not, handle it
        if(!isMatch){
            return done(null, false);
        }

        //Otherwise, return the user
        done(null, user);

    } catch(err){
        done(err, false);
    }
    

}))