/**
 * triptimeslots
 *
 * @module      :: Model
 * @description :: Represent data model for the available trip timeslots
 * @author		  :: Loganathan
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var verror = require('verror');
var Schema = mongoose.Schema;
var _ = require('lodash');
var TripslotSchema = new Schema({
    trip_date: {
        type: Date,        
        required: true,
        unique:true,
        index:true
    },
    trip_time:[] ,
    created_on: {type: Date},
    activation_status: {type: String, enum: ['inactive', 'active']}
});
module.exports = mongoose.model('Tripslot', TripslotSchema);