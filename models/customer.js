/**
 * customer
 *
 * @module      :: Model
 * @description :: Represent data model for the std users
 * @author      :: Loganathan
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
//var verror = require('verror');
var Schema = mongoose.Schema;
var _ = require('lodash');
var CustomerSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: false
    },
    last_name: {
        type: String,
        trim: true,
        required: false
    },
    email: {
        primary_email: {
            email_id: {
                type: String, 
                required: false, 
                trim: true
//                index: {
//                    unique: true
//                }
            }, 
            is_verified: {
                type: Number, 
                default: 0
            }
        },
        alternate_email: {
            email_id: {
                type: String, 
                required: false, 
                trim: true
            },
            is_verified: {
                type: Number, 
                default: 0
            }
        }
    },
    contact: {
        primary_contact: {
            contact_no: {
                type: String, 
                trim: true 
            },is_verified: {
                type: Number, 
                default: 0
                }, 
              country_code: {
                  type: String,
                  default:"+91"
                  }},
              alternate_contact: {
                  contact_no: {
                      type: String, 
                      required: false, 
                      trim: true
                  }, 
                  is_verified: {
                      type: Number, 
                      default: 0
                      }, 
                  country_code: {
                      type: String,
                      default:"+91"
                      }
                  }
              },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    registration_type: {
        type: String,
        enum: ['facebook', 'google','viaetruck']
    },
    address: [{_id: false, address_name: {type: String}, address_data: {address1: {type: String}, address2: {type: String}, area: {type: String}, city: {type: String}, state: {type: String}, pincode: {type: String}, landmark: {type: String}}}],
    dob: Date,
    profilepic_url:{type:String},
    //in case of fb / google register 
    ref_id: {
        type : String
        //unique: true
    },
    created_on: {type: Date},
    activation_status: {type: String, enum: ['inactive', 'active', 'waiting']}
});
module.exports = mongoose.model('Customer', CustomerSchema);
