/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require("mongoose");
var truckCategory = require("../models/truckcategory");
var truckType =require("../models/trucktype");
var testing = require("../models/testing");

addTesting = function(req,res){
    var truck = new testing({
        name:req.body.name,
        image:req.body.image,
        category_id:req.body.ref_id
    });
    truck.save(function(err,saved){
        if(err){
            res.send({status:"failure"});
        }
        else
            res.send({status:"success",message:"added new test"});
            
    });    
};

getTesting =function(req,res){
    testing.findOne({_id:req.params.id}).populate('category_id').exec(function(err,tests){
        //console.log(tests);
        if(err){
            res.send({status:"failure"});
        }
        else{
            res.send({status:"success",tests:tests,message:tests.category_id.name});
        }
       
    });
};

module.exports.route = function (router) {
    router.post('/addtest', addTesting);
    router.get('/gettest/:id',getTesting);
}






