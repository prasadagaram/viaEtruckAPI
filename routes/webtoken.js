/* 
 *  authenctication.js
 * @module      :: models
 * @description :: Represent Authentication details
 * @author      :: Ram Prasad V
 */

var jwt = require ("jsonwebtoken");
var Login = require ("../models/login");
var express = require("express");
var app = express();
var config= require("../config");
var routes = express("../routes"); 

//SET SECRET KEY
app.set('superSecret', config.JWT_SECRET_TOKEN); // secret variable



//create token

  newToken = function(req,res){
    var login  = Login.findOne({
        user_Name : req.body.user_Name       
    },function(err,user){
        if(err) throw err;
        if(!user){
            res.json({success:false, message: 'Authentication failure, User not found'});
        }else if(user){
            if(user.password !== req.body.password){
                res.json({success:false, message: 'Authentication failure, password incorrect'});
            }else{
                 // if user is found and password is right
                 // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                expiresInMinutes: 1440 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
                }); 
            }
        }
    }

    );
};
module.exports.route = function(router){
    router.post('/authenticate',newToken);
};


