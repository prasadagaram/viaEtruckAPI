/**
 * socialauth
 *
 * @module      :: Model
 * @description :: Represent data model for the user registration through fb/google plus authentication
 * @author      :: Loganathan
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
//var verror = require('verror');
var Schema = mongoose.Schema;
var _ = require('lodash');
var SocialSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: false
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    profilepic_url: {type: String},
    auth_type: {type: String, enum: ["facebook", "google"]},
    //in case of fb / google register 
    ref_id: {
        type: String
                //unique: true
    },
    created_on: {type: Date},
    status: {type: String, enum: ["active", "deleted"]}

});
module.exports = mongoose.model('Social', SocialSchema);
