/**
 * Truck Owner
 *
 * @module      :: Model
 * @description :: Represent data model for the Truck Owners
 * @author      :: Ram Prasad
 */
var mongoose = require ("mongoose");
var relationship =require("mongoose-relationship");
var _ =require("lodash");
var verror =require("verror");
var Schema = mongoose.Schema;

var TruckOwnerSchema = new Schema({
  first_name : {
    type: String,
    lowercase: true,
    trim: true,
    required : false
  },
  last_name : {
    type: String,
    lowercase: true,
    trim: true,
    required : false
  },
  email: {
    primary_email: {
      email_id:{
        type: String,
        required: true,
        trim: true,
        index: {
          unique: true
        }
      },
      is_verified: {
        type: Number,
        default: 0
      }
    },
    alternate_email: {
      email_id:{
        type: String,
        required: false,
        trim: true,
        index: {unique: true}},
        is_verified: {
          type: Number,
          default: 0
       }
     }
   },

  promoters:[{
    _id : false,
    name : {
      type:String,
      required: false
    },
    email:{
      type:String,
      required:false
    },
    contact_no:{
      type:Number,
      required:false
    },
    trucks:[]
  }],
  contacts:[ {
        _id : false,
      contact_no : String,
      name : {type : String, required:false},
      designation : {type : String, required:false},
      required : false,
      trim : true,
      index : {unique:true},
      is_verified :{
        type: Number,
        default: 0
      },
      country_code:{
        type : String,
        default : '+91'
      }
    }
  ],
  gender: {
    type: String,
    enum: ['male', 'female']
  },
address: [{_id: false, address_name:{
  type: String
},
address_data:{
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  area: {
     type: String
   },
  city: {
     type: String
   },
  state: {
    type: String
  },
  pincode: {
    type: String
  },
  landmark: {
    type: String
  }
}
}],
dob : {
  type : Date,
  required:false
},
other_ref_id: [{id:  {
        type: Schema.Types.ObjectId
    },
    user_type: {
        type: String,
        enum: ['truckowner', 'corpuser']
    }
}],
  profilepic_url:{
    type:String,
    required : false
  },

  verification_status:{
    type:String,
    enum:['notverified','verified'],
    required:false
  },
  createdOn : {
    type:Date,
    required : false
  },
  activation_status:{
    type: String,
    enum: ['inactive', 'active', 'waiting'],
    required:false
  }
});
module.exports = mongoose.model('TruckOwner', TruckOwnerSchema);
