/**
 * triptimeslots
 *
 * @module      :: Model
 * @description :: Represent data model for the available trip timeslots
 * @author		  :: Loganathan
 */
var tripSlot = require("../models/triptimeslot");
var calendar = require("node-calendar");
var moment = require("moment");
// storing trip time slot
addTripSlot = function(req,res){
    tripSlot.findOne({trip_date: req.body.trip_date}, function (err, slot) {
        if (err)
            console.log(err);

        if (slot)
        {
            var trip_time = req.body.trip_time.split(",");
            trip_time.forEach(function (time)
            {
                console.log(time);
                if (slot.trip_time.indexOf(time) < 0)
                {
                    slot.trip_time.push(time);
                }
            });
            console.log(slot);
            slot.save(function (err, updated_slot) {
                if (err)
                    console.log(err);
                res.send({status: "success", details: updated_slot});

            });
        }
        else
        {
            var new_slot = new tripSlot({
                trip_date: req.body.trip_date,
                trip_time: [],
                created_on: new Date(),
                activation_status: "active"
            });
            var trip_time = req.body.trip_time.split(",");
            trip_time.forEach(function (time)
            {              
                new_slot.trip_time.push(time);
            });
            new_slot.save(function (err, slot) {
                if (err)
                    console.log(err);
                res.send({status: "success", details: slot});

            });
        }
    });
};

// get Timeslot by Date
getTimeSlotByDate = function(req,res){    
    tripSlot.findOne({trip_date: req.params.trip_date}, function (err, slot) {
        if (err)
            console.log(err);

        if (slot)
        {
            res.send({status: "success", details: slot.trip_time});
        }
        else
            res.send({status:"not available"});
    });
};

//get Timeslot by Month
getTimeSlotByMonth = function(req,res){
    var month_year = req.params.month_year;
    mmyyyy = month_year.split('_');
    
    var month = mmyyyy[0];
    var year = mmyyyy[1];
   

    tripSlot.find({
        trip_date:{
            "$gte":new Date(year+"-"+ month +"-01"),
            "$lte":new Date(year+"-"+ month +"-31")
        }}
    ,function(err,trips){
        if(err){
            console.log(err);
        }
        if(trips){
            
            res.send({status:"success",trips:trips});
        }
        else
            res.send({status:"failure"});
            
    });
        
   
};



module.exports.route = function(router){
    router.post('/timeslot/add',addTripSlot);
    router.get('/timeslot/:trip_date',getTimeSlotByDate);
    router.get('/timeslot/bymonth/:month_year',getTimeSlotByMonth);
};


