/**
 * Pricing
 *
 * @module      :: Model
 * @description :: Represent data model for the Pricing
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var Pricing = require("../models/pricing");
//add Pricings

addPricingDetail = function (req, res) {
    var pricing_details = JSON.parse(req.body.pricing_details);
    //console.log(pricing_details);
    var pricing = new Pricing({
        truck_details: {
            type_id: req.body.truck_type_id,           
            category_id: req.body.truck_category_id,
            
        },
        enabled: true,
        status: "available",
        created_date: Date(),
        pricing_details: pricing_details
    });
    pricing.save(function (err, saved) {
        console.log(err);
        if(saved){
            res.send({status:"success",message:"successfully added"});
        }
        else
            res.send({status:"price not saved"});
    });


};

module.exports.route = function(router){
    router.post('/pricing/add',addPricingDetail);
};



