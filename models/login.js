/**
 * login
 *
 * @module      :: Model
 * @description :: Represent data model for the login entries
 * @author		  :: Loganathan
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var verror = require('verror');
var Schema = mongoose.Schema;
var _ = require('lodash');
var LoginSchema = new Schema({
    ref_id: {type: Schema.Types.ObjectId},
    user_name:{
        email:{
            type:String
        },
        mobile:{
            type:String
        }
    },
    password: {type: String},
    user_type: {type: String, enum: ['admin', 'truckowner', 'corpuser', 'stduser', 'transportuser']},
    created_on: {type   : Date},
    status: {type: String, enum: ['active', 'deleted']}
});
module.exports = mongoose.model('Login', LoginSchema);
