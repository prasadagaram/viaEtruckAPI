/**
 * Truck Category
 *
 * @module      :: Model
 * @description :: Represent data model for the Truck category
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var relationship =require("mongoose-relationship");
var _ =require("lodash");
var verror =require("verror");
var Schema = mongoose.Schema;

var TruckCategorySchema = new Schema({
   name : {
       type: String,
       required: false,
       trim : true
   },
   image:{
       type: String,
       required: false,
       trim : true
   },
   description:{
       type: String,
       required: false,
       trim : true
   },
   speed_limit:[{
       type: String,
       required : false
   }],
   status:{
       type: String,
       enum : ['active','inactive','deleted']
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

module.exports = mongoose.model('TruckCategory', TruckCategorySchema);
