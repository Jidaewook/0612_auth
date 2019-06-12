const express = require('express');
const router = require('express-promise-router')();

const passport = require('passport');
const passportConf = require('../passport');

const {validateBody, schemas} = require('../helpers/routeHelpers');

const UserController = require('../controllers/users');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/signup')
    .post(validateBody(schemas.authSchema), UserController.signUp);

router.route('/signin')
    .post(validateBody(schemas.authSchema), passportSignIn, UserController.signIn);

router.route('/secret')
    .get(passport.authenticate('jwt', {session: false}), UserController.secret);

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', {session: false}), UserController.googleOAuth);

module.exports = router;