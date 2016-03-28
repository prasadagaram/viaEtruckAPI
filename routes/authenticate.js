/*  
 *  Authentication
 * @module      :: routes
 * @description :: 
 * @author      :: Ram Prasad 
 */

var configAuth = require("../config")();
// app/routes.js
module.exports = function(app, passport) {

   
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google'), function(req,res){
                res.redirect(configAuth.SUCCESS_URL + req.user._id + "/");
            });
    
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook'), function(req,res){
                if (req.user !== null){
                    res.redirect(configAuth.SUCCESS_URL + req.user._id + "/");
                }
                else
                    res.redirect("/failed"); //for facebook users having inactive email-id
            });

    
    //Success redirect URL response
    app.get('/profile',function(req,res){
        res.send("Welcome to ViaEtruck home");
    });
    //failure redirect URL response
    app.get('/failed',function(req,res){
        res.send("Please use other account to login viaEtruck");
    });
};

