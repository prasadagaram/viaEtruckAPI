/**
 * payment
 *
 * @module      :: Model
 * @description :: Represent data model for the login entries
 * @author      :: Ram Prasad V
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    ref_id: {
        type: String,
       // required: true,
       // ref: 'Quote'
    },
    request_data: {
        type: String,
        required: true
    },
    response: {
        response_code: {
            type: String,
          
        },
        response_message: {
            type: String
        },
        payment_id: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ["paid", "pending", "rejected"],
        default: "pending"
    },
    created_date: {
        type: Date,
        required: true
    },
    update_date: {
        type: Date,
       
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);