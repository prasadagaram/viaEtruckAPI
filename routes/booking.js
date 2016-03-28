/* 
 Booking
 * @module      :: Route
 * @description :: Represent Route for the Booking
 * @author      :: Ram Prasad
 */

var Bookings = require("../models/booking");
var Customers = require("../models/customer");
var Pricings = require("../models/pricing");
var Quotes = require("../models/quote");
var mongoose = require("mongoose");
var moment = require("moment");
var authenticate = require("../middleware/authentication");


// Booking a quote from visitor page

bookQuote = function (req, res) {
    var user = req.user;
    var category_id = req.body.category_id;
    var type_id = req.body.type_id;
    if (user.user_type === "stduser") {
        Customers.findOne({_id: user.ref_id}, function (err, customer) {
            if (customer) {

                var booking = new Bookings({
                    pickup_address: {
                        address: req.body.pickup_address,
                        coordinates: req.body.pickup_coordinates,
                        city_name: req.body.from_city_name
                    },
                    drop_address: {
                        address: req.body.drop_address,
                        coordinates: req.body.drop_coordinates,
                        city_name: req.body.to_city_name
                    },
                    truck_category_refid: req.body.category_id,
                    truck_type_refid: req.body.type_id,
                    customer_details: {
                        customer_id: customer._id
                    },
                    booked_on: moment(),
                    trip_date: req.body.date,
                    trip_time: req.body.time,
                    booking_status: "quoted",
                    status: "available"

                });
                booking.save(function (err, booked) {
                    console.log(booked);


                    if (booked) {
//                        
//                        Pricings.findOne({"truck_details.category_id":"56e6b4b8d83b44ce0e9d6add",        
//                        "truck_details.type_id":"56e91d1286e90e491e472607"},function(err,pricing){
                        var from_city = "hyderabad";
                        var to_city = "bangalore";
                        //var category_id = booked.truck_category_refid;
                        //var type_id = booked.truck_type_refid;
                        console.log(type_id);
                        var query = {"truck_details.type_id": type_id.toString(),
                            "truck_details.category_id": category_id.toString(),
                                    pricing_details: {$elemMatch: {from_city: booked.pickup_address.city_name,to_city:booked.drop_address.city_name}}

                        };
                        console.log(query);
                        Pricings.findOne(query, function (err, pricing) {
                            console.log("************");
                            console.log(pricing);

                            if (pricing) {
                                console.log(pricing.pricing_details[0]);
                                pricing.pricing_details.forEach(function (err, ind) {
                                    var prices = pricing.pricing_details[ind];
                                    console.log(prices);
                                    if (prices) {
                                        if (prices.from_city == booked.pickup_address.city_name && prices.to_city == booked.drop_address.city_name) {
                                            var total_price = prices.price;
                                            var amount_advance = (total_price/100) * 20
                                            var quote = new Quotes({
                                                booking_ref_id: booked._id,
                                                status: "not-paid",
                                                total_price: total_price,
                                                amount_advance: amount_advance
                                            });
                                            quote.save(function (err, saved) {
                                                console.log(err);
                                                if (saved) {
                                                    res.send({status: "success", quote:saved._id});
                                                } else {
                                                    res.send({status: "failure", message: "quote generation failed"});
                                                }
                                            });

                                        } 
                                    } 

                                });

                            }else {
                                Bookings.update({_id: booked._id}, {status: "not-available"}, function (err, updated) {
                                    if (updated) {
                                        res.send({status: "success", quote:updated._id});
                                    } else {
                                        res.send({status: "failure", message: "quote generation failed"});
                                    }
                                });
                            }

                        });



                    } else {
                        res.send({status: "failed", message: "quote not generated"});
                        console.log(err);
                    }
                });
            } else {
                res.send({status: "failed"});
            }
        });
    }

};

//getBookings by ID:
getBookingById = function (req, res) {
    var user = req.user;
    Customers.findOne({_id: user.ref_id}, function (err, customer) {
        if (customer) {
            Bookings.findById(req.params.id).exec(function (err, booking) {
                res.send({status: "success", booking: booking});
            });
        } else
            res.send({status: "failed"});
    });
};


//get Booked trips from standard user using middleware

getAllBookingsByToken = function (req, res) {
    var user = req.user;
    Customers.findOne({_id: user.ref_id}, function (err, customer) {
        if (customer) {
            Bookings.find({"customer_details.customer_id": customer._id}).populate('truck_type_refid', 'name').exec(function (err, booking_list) {

                if (!err) {


                    res.send({status: "success", booking: booking_list});
                } else {
                    res.send({status: "failure", message: "not booked"});
                }
            });
        } else {
            res.send({status: "failed", message: "not booked trips till now"});
        }
    });

};


//get all bookings
getAllBooking = function (req, res) {
    Bookings.find({}, function (err, bookings) {
        if (bookings) {
            res.send({status: "success", bookings: bookings});
        } else
            res.send({status: "failed", message: "no bookings found"});
    });
};

module.exports.route = function (router) {
    router.post('/bookquote', authenticate, bookQuote);
    router.get('/getmybookings', authenticate, getAllBookingsByToken);
    router.get('/getallbookings', getAllBooking);
    router.get('/booking/find/:id', authenticate, getBookingById);
};

