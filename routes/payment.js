/** 
 * paymnet
 *
 * @module      :: Routes
 * @description :: Routing for all the Payments
 * @author      :: Loganthan
 */
var Payment = require("../models/payment");
var crypto = require('crypto');
var config = require("../config")();

createPaymentData = function (req, res) {
    var crypto = require('crypto');
    var secret_key = config.PAYMENT_GATEWAY_DETAILS.SECRET_KEY;
    var post_arr = {
        channel: config.PAYMENT_GATEWAY_DETAILS.CHANNEL,
        account_id: config.PAYMENT_GATEWAY_DETAILS.ACCOUNT_ID,
        reference_no: req.body.quote_id,
        amount: req.body.amount,
        currency: config.PAYMENT_GATEWAY_DETAILS.CURRENCY,
        description: config.PAYMENT_GATEWAY_DETAILS.DESCRIPTION,
	return_url: config.PAYMENT_GATEWAY_DETAILS.RETURN_URL,
        mode: config.PAYMENT_GATEWAY_DETAILS.MODE,
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        country: req.body.country,
        email: req.body.email,
        phone: req.body.phone,
        ship_address: "",
        ship_city: "",
        ship_country: "",
        ship_name: "",
        ship_phone: "",
        ship_postal_code: "",
        ship_state: ""
    };
    var post_keylist = Object.keys(post_arr);
    post_keylist.sort();
    var response_arr = {};
    var hash_data = secret_key;
    for (var i in post_keylist)
    {
        if (post_arr[post_keylist[i]] != "")
        {
            //     post_val += post_keylist[i] + "=" + post_arr[post_keylist[i]] + "&";
            hash_data += '|' + post_arr[post_keylist[i]];
            response_arr[post_keylist[i]] = post_arr[post_keylist[i]];
        }
    }
    var hash_val = crypto.createHash('sha512').update(hash_data).digest('hex');
    hash_val = hash_val.toUpperCase();
    response_arr["secure_hash"] = hash_val;
    var request_data = JSON.stringify(response_arr);
    var payment = new Payment({
        ref_id: req.body.quote_id,
        request_data: request_data,
        created_date: Date()
    });
    payment.save(function (err, saved) {
        console.log(err);

        if (saved) {
            res.send({status: "success", payment_data: request_data});
        }
        else {
            res.send({status: "failed", message: "failed to save"});
        }
    });
};


//Add Payment Details 
getPaymentResponse = function (req, res) {

    if (req.body.ResponseCode == "0")
    {
        Payment.findOne({ref_id: req.body.MerchantRefNo, status: "pending"}, function (err, payment_result) {
            if (err)
                res.redirect(config.PAYMENT_GATEWAY_DETAILS.FAILURE_URL + "/0");
            if (payment_result)
            {
                payment_result.response = {
                    response_code: '0',
                    response_message: req.body.ResponseMessage,
                    payment_id: req.body.PaymentID

                };
                payment_result.status = "paid";
                payment_result.update_date = new Date();
                payment_result.save(function (err, result) {
                    if (err)
                        res.redirect(config.PAYMENT_GATEWAY_DETAILS.FAILURE_URL + "/2");
                    if (result)
                    {
                        res.redirect(config.PAYMENT_GATEWAY_DETAILS.SUCCESS_URL + result._id);
                    }
                });
            }
        });
    }
    else
    {
        res.redirect(config.PAYMENT_GATEWAY_DETAILS.FAILURE_URL + "/1");
    }
    //payment.find()
    /*
     if (req.body.ResponseCode === "0") {
     payment.status = "paid";
     } else if (req.body.ResponseCode === "1") {
     payment.status = "pending";
     } else if (req.body.ResponseCode === "2") {
     payment.status = "rejected";
     }
     console.log(payment);
     payment.save(function (err, saved) {
     if (saved) {
     res.send({status: "success", payment: saved});
     } else
     res.send({status: "failed", message: "failed to save payment"});
     });
     */
};


module.exports.route = function (router) {
    router.post('/payment/create', createPaymentData);
    router.post('/payment/response', getPaymentResponse);
};
