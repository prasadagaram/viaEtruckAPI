/* 
 * Authentication
 *
 * @module      :: Middleware
 * @description :: Represent middleware authentication for verification
 * @author      :: Ram Prasad
 */


var Customers = require('../models/customer.js');
var Login  = require('../models/login');
var jwt = require('jwt-simple');
var config = require('../config')();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logger = require('../lib/logger');

module.exports = function(req, res, next) {
	
	// If request has auth header
    var bearerToken;
    var bearerHeader = req.headers.authorization;
    
    //console.log(req.headers);
    
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader;
        //console.log(bearer);
        try{
        	bearerToken = jwt.decode(bearer, config.JWT_TOKEN_SECRET);	
        } catch(err) {
        	logger.info("Invalid token");
        	res.send(401, { error: 'invalid Token' });
        }
        
        Login.findById(mongoose.Types.ObjectId(bearerToken.loginid), function(err, user){
			if(err || !user) {
				logger.info("Authentication failure !!");
				res.send(401, { error: 'Unauthorized access' });
			} else {
				req.user = user;
				next();
			}
		});
    } else {
        res.statusCode = 403;
		res.send({ error: 'Forbidden access' });
    }
};