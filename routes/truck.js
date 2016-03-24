/* 
 * Truck
 * @module      :: routes
 * @description :: Represent routes for the Truck types and Truck Categories
 * @author      :: Ram Prasad V
 */

var TruckCategory = require("../models/truckcategory");
var TruckType = require("../models/trucktype");
var express = require("express");
var Truck = require("../models/truck");

//adding new truck category from admin
addTruckCategory = function(req,res){
    var truckcategory = new TruckCategory({
       name: req.body.name,
       image:req.body.image,
       description:req.body.description,
       speed_limit:req.body.speed_limit,
       status:req.body.status,
       created_by: req.body.created_by,
       created_date: Date()
       
    });
     truckcategory.save(function(err, truckcategory){
        if (err) console.log(err);
        
        return res.send({status : 'success',truckcategory: truckcategory});
    });
};

//adding truck type

addTruckType = function(req,res){
    var trucktype = new TruckType({
        name : req.body.name,
        image: req.body.image,
        category_id:req.body.category_id,
        description: req.body.description,
        speed_limit: req.body.speed_limit,
        status:"active",
        created_by: req.body.created_by,
        created_date: Date()                        
    }) ;
    trucktype.save(function (err,trucktype){
        if (err) 
            return res.send(err);
        else
            res.send({status : 'success',trucktype: trucktype});
    });
};

//To modify already added truck category
modifyTruckCategory = function(req,res){
    var truckcategory = req.truckcategory;
    if(req.body.image){
        image : req.body.image;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }
    if(req.body.speed_limit){
        speed_limit:req.body.speed_limit;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }
    if(req.body.status){
        status:req.body.status;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }    
    truckcategory.save(function (err,truckcategory){
        if(err)
            return res.send(err);
        else
            return res.send({status: 'success', truckcategory:truckcategory});
    });       
};

// To modify already stored truck types
modifyTruckType = function(req,res){
    var trucktype = req.trucktype;
    if(req.body.image){
        image : req.body.image;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }
    if(req.body.speed_limit){
        speed_limit:req.body.speed_limit;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }
    if(req.body.status){
        status:req.body.status;
        updated_by: req.body.updated_by;
        updated_date: Date();
    }    
    trucktype.save(function (err,trucktype){
        if(err)
            return res.send(err);
        else
            return res.send({status: 'success', trucktype:trucktype});
    });       
};

//to list the all the truck category
listAllTruckCategories =  function(req,res){
    TruckCategory.find(function (err, trucks) {
        if (!err) {
            return res.send({status:"success",trucks:trucks});
        } else {
            return res.send(err);
        }
    });
};
//to get particular truck category using id
showTruckCategory = function(req,res){
    var query = TruckCategory.findById({_id:req.body.truckid});
    return query.exec(function(err,truck){
        if (!err)
            return res.send({status:"success",truck:truck});
        else
            return res.send(err);
    });
};

//to get all the truck types
listAllTruckTypes =  function(req,res){
    TruckType.find().populate('category_id','_id name').exec(function (err, trucks) {
        if (!err) {
            return res.send({status:"success",trucktype_list:trucks});
        } else {
            return res.send(err);
        }
    });
};
// To get truck type using ID
showTruckType = function(req,res){
    var query = TruckType.findById({_id:req.body.truckid});
    return query.exec(function(err,truck){
        if (!err)
            return res.send({status:"success",truck:truck});
        else
            return res.send(err);
    });
};


//To get truck types using category referencing id
getTruckTypes = function(req,res){
    //var id = req.params.ref_id;
    //console.log(id);
    var query = TruckType.find({category_id:req.params.id}).select('_id name image');
    return query.exec(function(err,truck){
        if (!err){
            return res.send({status:"success",truck:truck});
        }
        else
            return res.send(err);
    });
};

//To get truck types by id
getTruckTypeById = function(req,res){
    //var id = req.params.ref_id;
    //console.log(id);
    var query = TruckType.findOne({_id:req.params.id}).select('_id name image');
    return query.exec(function(err,truck){
        if (!err){
            return res.send({status:"success",truck:truck});
        }
        else
            return res.send(err);
    });
};


// To deactivate the truck category
removeTruckCategory = function(req,res){
    var truckcategory = req.truckcategory;
    if(req.body.activation_status){
        truckcategory.status = "deleted";
    }
    truckcategory.save(function(err,res){
        if(!err){
            return res.send({status:"success",truckcategory:truckcategory});
        }
        else
            return res.send(err);
    });
} ;

// To deactivate the truck type
removeTruckTypes = function(req,res){
    var trucktype = req.trucktype;
    if(req.body.activation_status){
        trucktype.status = "deleted";
    }
    trucktype.save(function(err,res){
        if(!err){
            return res.send({status:"success",trucktype:trucktype});
        }
        else
            return res.send(err);
    });
};

//adding trucks 
addTruck = function (req, res) {
    
    console.log(req.body.permitted_states);     
    console.log(req.body.operating_locations);
    console.log(req.body.home_location);
    var permitted_states_arr = req.body.permitted_states.split(",");
if(req.body.national_permit == "true"){
        permitted_states_arr = [];
    }	
    var truck_details = {
        makers_name: req.body.truck_details.makers_name,
        manufacturing_month: req.body.truck_details.manufacturing_month,
        manufacturing_year: req.body.truck_details.manufacturing_year,
        cubic_capacity: req.body.truck_details.cubic_capacity

    };
    var truck_entry = new Truck(
            {
                registered_date: req.body.registered_date,
                registered_number: req.body.registered_number,
                used_by_owner: req.body.used_by_owner,
                category_id: req.body.category_id,
                type_id: req.body.type_id,
                truck_owner_details:{name:req.body.registered_owner_name},
                capacity: req.body.capacity,
                fuel_type: req.body.fuel_type,
                gps_enabled: req.body.gps_enabled,
                national_permit: req.body.national_permit,
                permitted_states: permitted_states_arr,
                truck_details: truck_details,
                home_location: req.body.home_location.split(","),
                operating_locations: req.body.operating_locations.split(","),
                verification_status: "verified",
                created_date: new Date(),
                updated_date: new Date()


            }
    );
    truck_entry.save(function (err, result) {
        if (err)
            console.log(err);

        res.send({status: "success", message: result});
    });
};


//To get list of trucks 
listAllTrucks = function (req, res) {
    Truck.find({}, function (err, trucks) {
        if (!err) {
            return res.send({status: "success", truck: trucks});
        }
        else
        {
            return res.send(err);
        }
    });
};

module.exports.route = function(router){
    router.post('/truck/category',addTruckCategory);
    router.post('/truck/type',addTruckType);
    router.put('/truck/category/:id',modifyTruckCategory);
    router.put('/truck/type/:id',modifyTruckType);
    router.get('/truck/categories',listAllTruckCategories);
    router.get('/truck/types',listAllTruckTypes);
    router.post('/truck/categorybyid',showTruckCategory);
    router.post('/truck/typebyid',showTruckType);
    router.post('/truck/removecategory',removeTruckCategory);
    router.post('/truck/removetype',removeTruckTypes);    
    router.get('/truck/category/type/:id',getTruckTypes);
    router.post('/truck',addTruck);
    router.get('/trucks', listAllTrucks);
    router.get('/truck/type/:id',getTruckTypeById);
};
