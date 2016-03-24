/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TruckCategory =  require("../models/truckcategory");

var TruckTypeSchema = new Schema({
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
   category_id:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'TruckCategory'
       
   }
});
module.exports = mongoose.model('Testing', TruckTypeSchema);


