/**
 * Booking
 *
 * @module      :: Model
 * @description :: Represent data model for the Booking
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var relationship =require("mongoose-relationship");
var _ =require("lodash");
var verror =require("verror");
var Schema = mongoose.Schema;
var TruckType = require("../models/trucktype");

var BookingSchema = new Schema({
    booking_id : {
        type: String,
        required: false
    },
    pickup_address:{
            contact_name : String,
            contact_no   : String,
            address      : String,
            city_name    : String,   
            coordinates  : String,
            _id :false
    },
    drop_address:{
            contact_name : String,
            contact_no   : String,
            address      : String,
            city_name    : String,
            coordinates  : String,
            _id :false
    },
    
    truck_category_refid:{
        type :Schema.Types.ObjectId,
        require:false
    },
    truck_type_refid:{
        type :Schema.Types.ObjectId,
        require:true,
        ref: 'TruckType'
    },
    
    load_details:{
               
        weight: String,
        material_type:   String
               
    },
    customer_details:[{
        customer_id:{
            type: Schema.Types.ObjectId,
            required:true,
            _id :false            
        },
        customer_name : String,
        contact_no   : String,
        address      : String,
        _id :false
        
    }],
    additional_details:[{
        _id:false
    }],
    booked_on: Date,
    trip_date: Date,
    trip_time: String,
    expected_deliverydate : Date,
    booking_status:{
        type: String,
        enum: ['booked','processing','quoted']
    },
    status:{
       type: String,
       enum : ['available','not-available']
   },
   created_by:{id:  {
          type: Schema.Types.ObjectId,
          required: false
        }
   },
   updated_by :{id:{
          type: Schema.Types.ObjectId 
        }
       
   },
   created_date:{
       type :Date
   },
   updated_date:{
       type :Date
   }
});
   
module.exports = mongoose.model('Booking', BookingSchema);



