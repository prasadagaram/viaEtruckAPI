/**
 * Pricing
 *
 * @module      :: Model
 * @description :: Represent data model for the Pricing
 * @author      :: Ram Prasad
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PricingSchema = new Schema({
    truck_details: {
            type_id: {
                    type: Schema.Types.ObjectId,
                    required:true
                },
            category_id: {
                    type: Schema.Types.ObjectId,
                    required:true
                },
            manufacturer: {
                type: String,
                required: false
            },
            truck_id: {
                id: {
                    type: Schema.Types.ObjectId
                }
            },
            manufacturing_month: {
                type: Number
            },
            manufacturing_year: {
                type: Number
            }

        }  ,
    pricing_details: [{
            from_city: {type: String},
            to_city: {type: String},
            price: {type: Number},
            _id:false
        }],
    owner_id: {
        id: {
            type: Schema.Types.ObjectId
        }
    },
    category: {
        type: String,
        enum: ["owner", "admin"]
    },
    enabled: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'not-available']
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

module.exports = mongoose.model('Pricing', PricingSchema);

