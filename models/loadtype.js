/**
 * Load Types
 *
 * @module      :: Model
 * @description :: Represent data model for the Load types
 * @author      :: Ram Prasad
 */

var mongoose = require("mongoose");
var relationship =require("mongoose-relationship");
var _ =require("lodash");
var verror =require("verror");
var Schema = mongoose.Schema;

var LoadTypeSchema = new Schema({
   name : {
       type: String,
       required: false,
       trim : true
   },
   description:{
       type: String,
       required: false,
       trim : true
   },
   status: {
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
module.exports = mongoose.model('LoadType', LoadTypeSchema);
