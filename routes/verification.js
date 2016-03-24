/* 
 * verification
 *
 * @module      :: Routes
 * @description :: Represent route for verification
 * @author      :: Loganathan
 */
var utils = require('../lib/utils');
var Verification = require('../models/verfication.js');
var common = require('../lib/common');
var moment = require('moment');
var logger = require('../lib/logger');


var verifyUser = function (req, res) {
    Verification.findOne({
        primary_contact: req.body.contact, verification_code: req.body.verification_code}, function (err, verificationModel) {
        if (err) {
            //errorHandler.sendServerError(res, err);
            res.send(err);
        } else {
            if (verificationModel) {
           
                res.send({status: "success",id: verificationModel._id});
            }
            else
            {
                res.send({status: "failure", message: "Invalid or expired verfication code"});
            }
        }
    });
};




var sendVerificationCode = function (req, res) {
    var code = common.generateRandomNumber(10000, 99999);
    var verify = new Verification({
        primary_contact: "919025583232",
        verification_code: code,
        type: "mobile",
        created: moment()
    });
    Verification.findOne({
        primary_contact: verify.primary_contact}, function (err, verificationModel) {
        if (err) {
            //errorHandler.sendServerError(res, err);
        } else {
            var newCodeTobeSent = true;
            if (verificationModel) {
                // Check expiry time
                var expiry = moment(verificationModel.created).add(5, 'm');
                if (moment().isBefore(expiry)) {
                    // Code expired, retry again
                    logger.info("Resending old verification code");

                    var mobileNumber = verify.primary_contact;
                    utils.sendSMS(mobileNumber, 'Dear Logu Your OTP ' + verificationModel.verification_code + '' + ' www.VIAETRUCK.com', function (err, result) {
                        if (err) {
                            logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                        } else {
                            logger.info('Successfully sent verification code');
                        }
                    });
                    newCodeTobeSent = false;
                    return res.send({status: 'success', verification_code: verificationModel.verification_code});
                }

            }

            if (newCodeTobeSent) {
                Verification.update({primary_contact: verify.primary_contact}, {$set: verify.toObject()}, {upsert: true}, function (err) {
                    if (!err) {
                        // Send the verification code via sms
                        logger.info("Verification code sent: " + verify.verification_code);

                        var mobileNumber = verify.primary_contact;
                        utils.sendSMS(mobileNumber, 'Dear Logu Your OTP ' + verify.verification_code + '' + ' www.VIAETRUCK.com', function (err, result) {
                            if (err) {
                                logger.error(new verror(err, 'Error in sending verification code to ' + mobileNumber));
                            } else {
                                logger.info('Successfully sent verification code');
                            }
                        });
                        return res.send({status: 'success', verification_code: verify.verification_code});
                    } else {
                        logger.info('Error while creating verification object: ' + err);
                        // errorHandler.sendServerError(res, err);
                    }
                });
            }

        }

    });
};
module.exports.route = function (router) {
    router.post('/user/verify', verifyUser);
};
