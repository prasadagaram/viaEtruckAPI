/**
 * Quote
 *
 * @module      :: Model
 * @description :: Represent data model for the Quote
 * @author      :: Ram Prasad
 */

var mongoose = require("mongosose");
var Bookings = require("../models/booking");
var Quote = require("../models/quote");
var Pricing = require("../models/pricing");

//creating quote 

generateQuote = function(req,res){
    Bookings.findById(req.body.booking_id).exec(function(err,booking){
        if(booking){
            Pricing.findOne({$and:
                        [{"booking.truck_details.category_id":booking.truck_category_refid},        
                        {"booking.truck_details.type_id":booking.truck_type_refid}]                
            }, function(err,pricing){
                if(pricing){
                    var quote = new Quote({
                        booking_ref_id:req.body.booking_id,
                        status:"not-paid",
                        price: pricing.truck_details.price,
                        amount_advance:(pricing.truck_details.price/100)*20 
                    });
                    quote.save(function(err,saved){
                        if(saved){
                            res.send({status:"success",message:"quote saved successfully"});
                        }
                        else
                            res.send({status:"failed to save"});
                       
                    });
                    
                }
                else
                    res.send({status:"failed",message:"no pricing available"});
            });    
        }
        else
            res.send({status:"failed",message:"no bookings found"});
    });
};
    
    
module.exports.route = function(router){
    router.post("/quote/create",generateQuote);
};

    