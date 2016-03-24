/**
 * Truck
 *
 * @module      :: Model
 * @description :: Represent data model for the Truck info
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var relationship = require("mongoose-relationship");
var _ = require("lodash");
var verror = require("verror");
var Schema = mongoose.Schema;

var TruckSchema = new Schema({
    truck_id: {
        type: String
    },
    registered_date: {
        type: Date
    },
    registered_number: {
        type: String
    },
    used_by_owner: {
        type: Boolean
    },
    category_id: {
        type: Schema.Types.ObjectId
    },
    type_id: {
        type: Schema.Types.ObjectId
    },
    capacity: {
        type: String
    },
    fuel_type:
            {
                type: String
            },
    gps_enabled:
            {
                type: Boolean
            },
    gps_provider_details: [],
    national_permit:
            {
                type: Boolean
            },
    permitted_states: [],
    truck_owner_details: {
        name:{
            type:String
        }
    },
    body_type_id: {
        type: Schema.Types.ObjectId
    },
    vehicle_class: {
        type: Schema.Types.ObjectId
    },
    truck_details: {
        makers_name: String,
        manufacturing_month: Number,
        manufacturing_year: Number,
        cubic_capacity: String
    },
    home_location: [],
    operating_locations: [],
    owner_id: {
        type: Schema.Types.ObjectId
    },
    other_info: [],
    verification_status: {
        type: String,
        enum: ["verified", "expired", "waiting"]
    },
    status: {
        type: String,
        enum: ["deleted", "active"],
        default: "active"
    },
    created_date: {
        type: Date
    },
    updated_date: {
        type: Date
    },
    added_by: {
        type: Schema.Types.ObjectId
    },
    updated_by: {
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Truck', TruckSchema);



