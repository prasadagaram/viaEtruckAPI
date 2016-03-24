/** 
 Truck Owner Corporate User 
 *
 * @module      :: Route Index
 * @description :: Routing for all the API's
 * @author      :: Ram Prasad
 */
var router = require('express').Router();
require ('./customer').route(router);
require('./webtoken').route(router);
require('./verification').route(router);
require('./truck').route(router);
require('./login').route(router);
require('./triptimeslot').route(router);
require('./booking').route(router);
require('./testing').route(router);
require('./pricing').route(router);
require('./payment').route(router);
module.exports = router;

