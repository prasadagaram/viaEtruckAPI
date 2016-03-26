

	/* 
 *  Configuration
 * @module      :: Model
 * @description :: Represent data for the Default Configuration
 * @author      :: Loganathan.
 */

module.exports = function () {
    switch (process.env.NODE_ENV) {
        default:
        case 'dev' :
            return {
                MONGO_SERVER_PATH: "mongodb://localhost:27017/viaetruck",
                APP_PORT: 8080,
                GOOGLE_CREDENTIALS: {
                    'clientID': '614748459278-lg8p9er3d5n7l6co77b7bs9kfm9p2hvc.apps.googleusercontent.com',
                    'clientSecret': '9zwio4nnjKiDoxRr0GyUQcyW',
                    'callbackURL': 'http://www.viaetruck.com:8080/auth/google/callback'
                },
                FACEBOOK_CREDENTIALS: {
                    'appId': '468959609979777',
                    'appSecret': 'b8baaa5a0e2a9e48806dad1c9f43790d',
                    'host': 'http://www.viaetruck.com:8080/auth/facebook/callback'

                },
                SUCCESS_URL: "http://www.viaetruck.com/socialauth/success/",
                FAILURE_URL: "http://www.viaetruck.com/socialauth/failure",
                SMS_GATEWAY_DETAILS: {
                    USER_ID: 'viaetruck',
                    PASSWORD: 'welcome123',
                    SENDER_ID: 'VAETRK',
                    URL: 'http://www.smscountry.com/SMSCwebservice_Bulk.aspx'
                },
                EMAIL_GATEWAY_DETAILS:{
                    API_KEY: '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',
                    FROM_EMAIL:'noreply@viaetruck.com'
                },
                JWT_TOKEN_SECRET: "xn29d39ca08631ea94370d597324338c",
                PAYMENT_GATEWAY_DETAILS:{
                        SECRET_KEY:"e7f57531995317edab69526a3a0ebb54",
                        CHANNEL:"10",
                        ACCOUNT_ID:"18718",
                        CURRENCY:"INR",
                        DESCRIPTION:"test",
                        RETURN_URL:"http://viaetruck.com:8080/api/v0/payment/response",
                        MODE:"LIVE",
                        FAILURE_URL:"http://viaetruck.com/payment/response/failure/",
                        SUCCESS_URL:"http://viaetruck.com/stdusr/#/payment/response/success/"
                    
                }
            };
            break;
    }

};



