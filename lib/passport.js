/* 
 *All process related to authenticating to google and facebook servers
 * Author : Ram Prasad V
 * config/passport.js
 */

// load all the things we need
//var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the auth model
var Auth = require('../models/socialauth');

// load the auth variables
var configAuth = require('../config')();

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        Auth.findById(id, function (err, user) {
            done(err, user);
        });
    });
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID: configAuth.GOOGLE_CREDENTIALS.clientID,
        clientSecret: configAuth.GOOGLE_CREDENTIALS.clientSecret,
        callbackURL: configAuth.GOOGLE_CREDENTIALS.callbackURL

    },
    function (token, refreshToken, profile, done) {
        // console.log(profile);

        // make the code asynchronous
        // Auth.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {

            // try to find the user based on their google id
            Auth.findOne({'ref_id': profile.id}, function (err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else

                {
                    // if the user isnt in our database, create a new user
                    var newUser = new Auth();

                    // set all of the relevant information
                    newUser.ref_id = profile.id;
                    newUser.first_name = profile.displayName;
                    newUser.profilepic_url = profile.photos[0].value;
                    newUser.gender = profile.gender;
                    newUser.registration_type = "google";
                    if (profile.emails[0] != undefined)
                    {
                        if (profile.emails !== undefined) {
                            var email = profile.emails[0].value;
                            newUser.email = email;
                        }
                    }
                    //newUser.google.token = token;

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        //console.log(newUser);
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.FACEBOOK_CREDENTIALS.appId,
        clientSecret: configAuth.FACEBOOK_CREDENTIALS.appSecret,
        callbackURL: configAuth.FACEBOOK_CREDENTIALS.host,
        profileFields: ['id', 'emails', 'name', 'photos']
    },
    // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {
        console.log(profile);
        console.log("====================================================");


        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            Auth.findOne({'ref_id': profile.id}, function (err, user) {
                //console.log(user);
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {

                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
//                    console.log(profile.name.familyName);
//                    console.log("8888888888888 " + profile.name.givenName);
//                    console.log(profile.id);

                    // set all of the facebook information in our user model
                    newUser.ref_id = profile.id; // set the users facebook id                   
                    newUser.first_name = profile.name.givenName; // we will save the token that facebook provides to the user                    
                    newUser.last_name = profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.profilepic_url = profile.photos[0].value;
                    if (profile.emails !== undefined) {
                        var email = profile.emails[0].value;
                        newUser.email = email;
                    }
                    // save the user

                    // save our user to the database
                    newUser.save(function (err, user) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });



                }

            });
        });

    }));

};

