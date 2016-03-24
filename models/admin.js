/**
 * admin
 *
 * @module      :: Model
 * @description :: Represent data model for the backend admin users
 * @author		  :: Loganathan
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var verror = require('verror');
var Schema = mongoose.Schema;
var _ = require('lodash');
var AdminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: false
    },
    last_name: {
        type: String,
        trim: true,
        required: false
    },
    email: {primary_email: {email_id: {type: String, required: true, trim: true, index: {unique: true}}, is_verified: {type: Number, default: 0}}, alternate_email: {email_id: {type: String, required: false, trim: true, index: {unique: true}}, is_verified: {type: Number, default: 0}}},
    contact: {primary_contact: {contact_no: {type: String, required: true, trim: true, index: {unique: true}}, is_verified: {type: Number, default: 0}, country_code: {type: String, default: "+91"}}, alternate_contact: {contact_no: {type: String, required: false, trim: true, index: {unique: true}}, is_verified: {type: Number, default: 0}, country_code: {type: String, default: "+91"}}},
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    dob: Date,
    profilepic_url: {type: String},
    role_id: {type: Schema.Types.ObjectId},
    created_on: {type: Date},
    activation_status: {type: String, enum: ['inactive', 'active', 'waiting']}
});
module.exports = mongoose.model('Admin', AdminSchema);
