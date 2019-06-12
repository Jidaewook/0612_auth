const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const userModel = require('./models/user');
const GooglePlusTokenStrategy = require('passport-google-plus-token');


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


//Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    // clientID: config.oauth.google.clientID,
    // clientSecret: config.oauth.google.clientSecret
    clientID: '50670876772-5vckqht5afnd3fho4ha5jickhrebig5t.apps.googleusercontent.com',
    clientSecret: 'DbuE3Snj4MAZ6JuzsJmpmr9G'
}, async(accessToken, refreshToken, profile, done)=> {
    try{
        //sholud have full user profile over here
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        
        const existingUser = await userModel.findOne({"google.id": profile.id});
        if(existingUser){
            console.log('existing user');
            return done(null, existingUser);
        }

        //New user
        const newUser = new userModel({
            method: 'google', 
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
        
    } catch(error){
        done(error, false, error.message);
    }
}))

