/* 
 *  login
 *
 * @module      :: Routes
 * @description :: Represent data model for the login entries
 * @author      :: Ram Prasad
 */
var Login = require("../models/login.js");
var Customer = require("../models/customer");
var authenticate = require("../middleware/authentication");
var Verification = require('../models/verfication.js');
var express = require("express");
var common = require('../lib/common');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config')();
var logger = require('../lib/logger');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('../lib/utils');
var validateemail = require("../middleware/validatemail");

//New viaEtruck password saving and login token generation
createLogin = function (req, res) {
    Verification.findById(mongoose.Types.ObjectId(req.body.verification_id)
            , function (err, verificationModel) {
                if (err) {
                    //errorHandler.sendServerError(res, err);
                } else {
                    if (verificationModel) {
                        Login.findOne({"user_name.contact": req.body.contact}, function (err, login) {
                            if (login) {
                                res.send({status: "failure", message: "contact already exists"});
                            } else if (!login) {
                                var login = new Login({
                                    user_name: {email: "", mobile: req.body.contact},
                                    password: req.body.password,
                                    user_type: req.body.user_type,
                                    ref_id: req.body.ref_id,
                                    created_on: Date(),
                                    status: "active"
                                });
                                login.save(function (err, login) {
                                    //              Remove the used verification code
                                    Verification.remove({_id: verificationModel._id}, function (err) {
                                        if (err) {
                                            logger.info("Error in deleteing verification code: " + err);
                                        } else {
                                            logger.info("Verification code deleted");
                                        }
                                    });
                                    if (err)
                                    {
                                        console.log(err);
                                    }
                                    var token = jwt.encode({
                                        loginid: login._id, exp: moment(),
                                        userid: login.ref_id,
                                        usertype: login.user_type
                                    }, config.JWT_TOKEN_SECRET);
                                    return res.send({status: "success", auth_token: token});
                                });
                            }
                        });

                    } else
                    {
                        res.send({status: "failure", message: "Invalid verfication data"});
                    }

                }
            });
};

// to save the login credentials after
userLogin = function (req, res)
{
    var login_query = {};
    if (req.body.email !== undefined && req.body.email !== "")
    {
        login_query = {"user_name.email": req.body.email, "password": req.body.password};
    } else if (req.body.mobile !== undefined && req.body.mobile !== "")
    {
        login_query = {"user_name.mobile": req.body.mobile, "password": req.body.password};
    }

    if (login_query["password"] !== undefined)
    {
        Login.findOne(login_query, function (err, user) {
            console.log(user);
            if (user)
            {
                var token = jwt.encode({loginid: user._id, exp: moment(), userid: user.ref_id, usertype: user.user_type}, config.JWT_TOKEN_SECRET);
                return res.send({status: "success", auth_token: token});
            } else
            {
                res.send({status: "failure", message: "invalid username or password"});
            }
        });
    } else
    {
        res.send({status: "failure", message: "invalid params"});
    }
};



//forgot Password for mobile login 

forgetPasswordMobile = function(req,res){
    Login.findOne({"user_name.mobile":req.body.mobile},function(req,login){
        //console.log(login);
        if(login){
           if(login!==undefined){
                var mobileNumber = login.user_name.mobile;
                var code = common.generateRandomNumber(10000, 99999);
                var verification = new Verification({
                    primary_contact: mobileNumber,
                    verification_code: code,
                    created: moment(),
                    type: "mobile"
                });
                utils.sendSMS(mobileNumber, 'Dear customer  Your OTP ' + code + ' to reset your password ' + ' www.VIAETRUCK.com', function (err, response) {
                    if (err) {
                        logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                    }
                    else if(response){
                        Verification.findOne({primary_contact: verification.primary_contact}, function (err, verified) {
                            //console.log(verified);
                            if(verified){
                                Verification.update({_id:verified._id},{verification_code: code},function(err,result){
                                    if(err){
                                        console.log(err);
                                    }
                                    else {
                                        console.log("updated old one");
                                        return res.send({status:"success",message:"OTP sent to mobile",id:verified._id});
                                    }
                                });
                            }
                            else if(!verified){
                                verification.save(function(err,saved){
                                    if(err){
                                        console.log("not saved new verification");
                                    }
                                    else{
                                        console.log("saved new verification");
                                        return res.send({status:"success",message:"OTP sent to mobile",id:saved._id});
                                    }
                                });
                            }
                            else
                                console.log(err);
                        
                        });
                        
                    }
                });
            }
            
       } 
       else
           return res.send({status:"failure",message:"Mobile number not Found"});
    });
};


//// Forgot Password for Email as Login

forgetPasswordEmail = function(req,res){
    Customer.findOne({"email.primary_email.email_id":req.body.email},function(err,customer){
        console.log(customer);
        if(customer){
            Login.findOne({ref_id: customer._id}, function (err, login) {
                console.log(login);
                if (login) {
                    if (login !== undefined) {
                        var email = req.body.email;
                        var key = jwt.encode({loginid: login._id,exp: moment()},config.JWT_TOKEN_SECRET);
                        var words = "Click below link to reset your viaEtruck login password \n";
                        var link = "<a href='http://www.viaetruck.in/#/resetpassword/" + key + "'>click me</a>"; 
                        
                        var email_payload = {
                            receipient: email,
                            subject: "Reset Password",
                            text: words + link
                        };
                        utils.sendEmail(email_payload, function (err, response) {
                            if (err)
                                console.log(err);
                            else if(response){
                                Verification.findOne({"primary_contact":email},function(err,verified){
                                    console.log(verified);
                                    if(verified){
                                        Verification.update({_id: verified._id}, {verification_key: key}, function (err, updated) {
                                            if (err)
                                                console.log(err);
                                            else {
                                                console.log("update success");
                                                console.log(updated);
                                                return res.send({status:"success",message:"reset password link successfully"});
                                            }
                                        });
                                    }
                                    else if(!verified){
                                        var verifying = new Verification({
                                            primary_contact: email,
                                            type: "email",
                                            created: moment(),
                                            verification_key: key
                                        });
                                        verifying.save(function (err, response) {
                                            if (err) {
                                                console.log("saavin neewaasfsdf546545d4sa45d456as4");
                                                console.log(err);
                                            }
                                            else
                                                console.log("saved new key");
                                                return res.send({status:"success",message:"reset password link successfully"});

                                        });
                                    }
                                    else
                                        console.log(err);
                                    
                                });
                            }
                        });
                    }
                }
                 else
                    return res.send({status:"email failed",message:"not having login account"});
            });
        }
        else
            return res.send({status:"email failed",message:"not a customer"});

    });
    
};





//getting User Details using authentication token 

getUserAfterLogin = function (req, res) {
    var user = req.user;
    if (user.user_type === "stduser") {
        Customer.findById(user.ref_id, function (err, customer) {
            if (customer) {
                return res.send({status: "success", customer: customer});
            } 
            else
                    return res.send(err);
            });
        }
        
};
        
//OTP confirmation after forgot password 
confirmOtp = function(req,res){
    Verification.findOne({_id:req.body.id},function(err,verified){
        if(verified){
            if(verified.verification_code === req.body.code){
                return res.send({status:"success",message:"OTP matched"});
            }
            else
                return res.send({status:"failure",message:"OTP unmatch"});
        }
    });
    
};
        
//Reset Password after OTP confirmation
resetPasswordmobile = function(req,res){
    Verification.findOne({_id:req.body.id},function(err,verified){
        if(verified){
            Login.findOne({"user_name.mobile":verified.primary_contact},function(err,login){
                if(login){
                    Login.update({_id:login._id},{password:req.body.password},function(err,resp){
                        if(err){
                            return res.send({status:"failure",message:"password not updated"});
                        }
                        else{
                            Verification.remove({_id:req.body.id},function(req,res){
                                if(err){
                                    console.log(err);
                                }
                                else
                                    console.log("deleted verification");
                            });
                            return res.send({status:"success",message:"password updated successfully"});
                        }
                    });
                }
                else
                    return res.send("err");
            });
        }
        else{
            return res.send({status:"failure",message:"err"});
        }
    });
};


// Email Password Resetting password
resetPasswordEmail = function(req,res){
    var user = req.user;
    Login.update({_id:user._id},{password:req.body.password},function(err,login){
        if(login){
            Verification.remove({ref_id:login._id},function(err,deleted){
                if(err){
                    console.log("verification not deleted");
                    return res.send({status:"password not updated"});
                }
                else if(deleted){
                    console.log("deleted verification");
                    return res.send({status:"success",message:"password updated"});
                }              
                
            });
        } 
    });
    
};

//Update Password from Standard User Page
updatePassword =  function(req,res){
    var user = req.user;
    console.log(user);
    if(user.password === req.body.old_password){
        Login.update({_id:user._id},{password:req.body.password},function(err,login){
            console.log(login);
            if(login){
                res.send({status:"success",message:"password updated successfully"});
            }
            else{
                res.send({status:"failed to update"});
            }           
        }); 
    }
    else{
        res.send({status:"failed",message:"password incorrect"});
    }
    
};

        
        
module.exports.route = function (router) {
    router.post('/login/create', createLogin);
    router.get('/user/info', authenticate, getUserAfterLogin);
    router.post('/user/login', userLogin);
    router.post('/user/login/mobile/forgotpassword', forgetPasswordMobile);
    router.post('/user/login/email/forgotpassword', forgetPasswordEmail);
    router.post('/user/login/confirmotp', confirmOtp);
    router.post('/user/login/reset/passwordmobile', resetPasswordmobile);
    router.post('/user/login/reset/passwordemail',validateemail, resetPasswordEmail);
    router.post('/user/login/update/password', authenticate, updatePassword);
};                                                                  
