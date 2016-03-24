/**
 * Quote
 *
 * @module      :: Model
 * @description :: Represent data model for the Quote
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var Booking = require("../models/booking");

var Schema = mongoose.Schema;
var TruckType = require("../models/trucktype");

var QuoteSchema = new Schema({
    booking_ref_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Booking"
    },
    status: {
        type: String,
        enum: ['partially-paid', 'not-paid','fully-paid']
    },
    total_price: {
        type: Number,
        required: true
    },
    amount_advance: {
        type: Number,
        required: true
    },
    created_by: {id: {
            type: Schema.Types.ObjectId,
            required: false
        }
    },  
    updated_by: {id: {
            type: Schema.Types.ObjectId
        }

    },
    created_date: {
        type: Date
    },
    updated_date: {
        type: Date
    }

});

module.exports = mongoose.model('Quote', QuoteSchema);


