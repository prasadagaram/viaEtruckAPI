/**
 * verifcation
 *
 * @module      :: Model
 * @description :: Represent data model for the email/mobile verification
 * @author		  :: Loganathan
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerificationSchema = new Schema({
    primary_contact: {
        type: String,
        required: true,
        index: {unique: true, dropDups: true}
    },
    verification_code: {
        type: String
    },
    verification_key:{
        type:String
    },
    created: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'mobile']
    }
    //_id: false
});

module.exports = mongoose.model('verification', VerificationSchema);
