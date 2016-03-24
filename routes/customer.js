    /* 
 * Registration module
 *
 * @module      :: Routes
 * @description :: Represent API functiom for the customeer.js
 * @author      :: Ram Prasad V
 */
//var passport = require('passport');
var Customer = require('../models/customer.js');
var express = require('express');
var app = express();
var mongoose = require("mongoose");
var relationship = require("mongoose-relationship");
var Login = require('../models/login');
var utils = require('../lib/utils');
var Verification = require('../models/verfication.js');
var common = require('../lib/common');
var moment = require('moment');
var logger = require('../lib/logger');
var authenticate = require('../middleware/authentication');

// New User Registeration API
newRegister = function (req, res) {

    Customer.findOne({$or:
                [{"email.primary_email.email_id": req.body.email},
                    {"contact.primary_contact.contact_no": req.body.contact}]
    }, function (err, customer) {
        //console.log(customer);
        if (customer) {

            Login.findOne({ref_id: customer._id}, function (err, login) {
                if (login) {
                    res.send({status: "failed", message: "user already exists"});
                } else {
                    console.log("else condition");
                    customer.first_name = req.body.name;
                    customer.email.primary_email.email_id = req.body.email;
                    customer.contact.primary_contact.contact_no = req.body.contact;
                    customer.save(function (err, saved) {
                        console.log(saved);
                        if (saved) {
                            var code = common.generateRandomNumber(10000, 99999);
                            var verify = new Verification({
                                primary_contact: customer.contact.primary_contact.contact_no,
                                verification_code: code,
                                type: "mobile",
                                created: moment()
                            });
                            Verification.findOne({
                                primary_contact: verify.primary_contact}, function (err, verificationModel) {
                                if (err) {
                                    //errorHandler.sendServerError(res, err);
                                } else {
                                    console.log("else in verification");
                                    var newCodeTobeSent = true;
                                    if (verificationModel) {
                                        // Check expiry time
                                        var expiry = moment(verificationModel.created).add(5, 'm');
                                        if (moment().isBefore(expiry)) {
                                            // Code expired, retry again
                                            logger.info("Resending old verification code");
                                            var mobileNumber = verify.primary_contact;
                                            utils.sendSMS(mobileNumber, 'Dear ' + customer.first_name + ' Your OTP ' + verificationModel.verification_code + '' + ' www.VIAETRUCK.com', function (err, result) {
                                                if (err) {
                                                    logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                                                } else {
                                                    logger.info('Successfully sent verification code');
                                                }
                                            });
                                            newCodeTobeSent = false;
                                            return res.send({status: 'success', customer: customer});
                                        }

                                    }

                                    if (newCodeTobeSent) {
                                        Verification.update({primary_contact: verify.primary_contact}, {$set: verify.toObject()}, {upsert: true}, function (err) {
                                            if (!err) {
                                                // Send the verification code via sms
                                                logger.info("Verification code sent: " + verify.verification_code);
                                                var mobileNumber = verify.primary_contact;
                                                utils.sendSMS(mobileNumber, 'Dear ' + customer.first_name + ' Your OTP ' + verify.verification_code + '' + ' www.VIAETRUCK.com', function (err, result) {
                                                    if (err) {
                                                        logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                                                    } else {
                                                        logger.info('Successfully sent verification code');
                                                    }
                                                });
                                                return res.send({status: 'success', customer: customer});
                                            } else {
                                                logger.info('Error while creating verification object: ' + err);
                                                // errorHandler.sendServerError(res, err);
                                            }
                                        });
                                    }

                                }
                            });
                        } else
                            res.send({status:"failed"});
                    });
                }

            });
        } else{
            var customer = new Customer({
                first_name: req.body.name,
                email: {primary_email: {email_id: req.body.email}},
                contact: {primary_contact: {contact_no: req.body.contact}},
                created_on: new Date(),
                activation_status: 'active'
            });
            customer.save(function (err, saved) {
                if (saved) {
                    console.log(saved);
                    var code = common.generateRandomNumber(10000, 99999);
                    var verify = new Verification({
                        primary_contact: customer.contact.primary_contact.contact_no,
                        verification_code: code,
                        type: "mobile",
                        created: moment()
                    });
                    verify.save(function(err,saved){
                        if(saved){
                            logger.info("Verification code sent: " + verify.verification_code);
                         
                            var mobileNumber = verify.primary_contact;
                            utils.sendSMS(mobileNumber, 'Dear ' + customer.first_name + ' Your OTP ' + verify.verification_code + '' + ' www.VIAETRUCK.com', function (err, result) {
                                if (err) {
                                    logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                                } else {
                                    logger.info('Successfully sent verification code');
                                }
                            });
                            res.send({status: 'success', customer: customer});
                        }else {
                            logger.info('Error while creating verification object: ' + err);
                        }                            
                    });
                } else
                    res.send({status:"failed"});
            });
        }
    });

    
};



//Get all Users
getAllUsers = function (req, res) {
    Customer.find({}, function (err, customers) {
        if (customers) {
            res.send({status: "success", customers: customers});
        } else {
            res.send({status: "failed"});
        }
    });
};
//Get user details from DB using _id
getUserById = function (req, res) {
    var customer = Customer.findById(req.params.id);
    return customer.exec(function (err, customers) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(customers);
        }
    });
};
// Modify user details by user
modifyUser = function (req, res) {
    var user = req.user();
    if (req.body.email) {
        user.email = req.body.email;
    }
    if (req.body.gender) {
        user.gender = req.body.gender;
    }
    if (req.body.address) {
        user.address = req.body.address;
    }
    if (req.body.dob) {
        user.dob = req.body.dob;
    }
    if (req.body.profilepic_url) {
        user.profilepic_url = req.body.profilepic_url;
    }
    if (req.body.first_name) {
        user.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
        user.first_name = req.body.last_name;
    }
    user.save(function (err, user) {
        if (err)
            return res.send(err);
        else
            return res.send({status: 'success', user: user});
    });
};
// validate user email&mobile exists already (or) not
validateUser = function (req, res) {
    Customer.findOne({
        $or: [{"email.primary_email.email_id": req.body.email},
            {"contact.primary_contact.contact_no": req.body.mobile}]
    }, function (err, user) {
        console.log(user);
        if (user !== null) {
            if (user.email.primary_email.email_id !== null && user.email.primary_email.email_id === req.body.email)
            {
                Login.findOne({ref_id: user._id}, function (err, result) {
                    if (result) {
                        res.send({status: "failure", message: "email already exists"});
                    } else {
                        res.send({status: "success"});
                    }
                });
            } 
          else  if (user.contact.primary_contact.contact_no === req.body.mobile){
                Login.findOne({ref_id: user._id}, function (err, result) {
                    if (result) {
                        res.send({status: "failure", message: "mobile number already exists"});
                    } else {
                        res.send({status: "success"});
                    }
                });
            }
        } else if (err) {
            res.send(err);
        } else {
            res.send({status: "success"});
        }
    });
};
//To remove a customer not a login user *** for DEV purpose

removeUser = function (req, res) {
    Customer.remove({_id: req.params.id}, function (err, removed) {
        if (removed) {
            res.send({status: "success", message: "user removed"});
        } else
            res.send({status: "failed to delete"});
    });
};
module.exports.route = function (router) {
    router.post('/customer', newRegister);
    router.get('/customers', getAllUsers);
    router.get('/customer/:id', getUserById);
    router.post('/modifycustomer', authenticate, modifyUser);
    router.post('/customer/validate', validateUser);
    router.get('/customer/remove/:id', removeUser);
};







