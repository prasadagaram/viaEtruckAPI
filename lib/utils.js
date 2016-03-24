/* 
  utils
 *
 * @module      :: lib
 * @description :: Represent utils for sending sms and email verification
 * @author      :: Loganathan
 */
var config = require('../config')();
var logger = require('./logger');
var querystring = require('querystring');
var request = require('request');
var _ = require('lodash');
var sendgrid = require('sendgrid')(config.EMAIL_GATEWAY_DETAILS.API_KEY);


var sendSMS = function (receiver, content, cb) {
    var indiaNumber = receiver;
    var sms_userid = config.SMS_GATEWAY_DETAILS.USER_ID;
    var sms_pwd = config.SMS_GATEWAY_DETAILS.PASSWORD;
    var sender_id = config.SMS_GATEWAY_DETAILS.SENDER_ID;
    var params = {
        User: sms_userid,
        passwd: sms_pwd,
        mobilenumber: indiaNumber,
        message: content,
        mtype: 'N',
        sid: sender_id,
        DR: 'N'
    };
    var query = querystring.stringify(params);
    console.log(config.SMS_GATEWAY_DETAILS.URL + '?' + query);
    request.post(
            config.SMS_GATEWAY_DETAILS.URL + '?' + query,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    cb(undefined, 'success');
                } else if (error) {
                    cb(error);
                } else {
                    cb(new Error('Invalid response in sending SMS'));
                }
            }
    );
};

//sending email 

var sendEmail = function (emailPayload, cb) {    
    var email = new sendgrid.Email({
        to: emailPayload.receipient,
        from: config.EMAIL_GATEWAY_DETAILS.FROM_EMAIL,
        subject: emailPayload.subject,
        text: emailPayload.text
    });
    sendgrid.send(email, function (err, json) {
        if (err) {
            cb(err,"{}");
        }
        cb(null,json);
    });
};

module.exports = {
    sendSMS: sendSMS,
    sendEmail:sendEmail

};





