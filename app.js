//viaetruck main file

var express = require('express');
var mongoose = require('mongoose');
var app = express();                   
var morgan = require('morgan');   
var passport = require('passport');
var bodyParser = require('body-parser');   
var methodOverride = require('method-override');
var configAuth  = require ('./config')();
var routes = require('./routes');
var logger = require('./lib/logger');
var session      = require('express-session');
var flash    = require('connect-flash');
var request = require('request');


app.use(bodyParser.json({limit:'10mb'})); 	// pull information from html in POST
app.use(bodyParser.urlencoded({limit:'10mb', extended: true}));
app.use(methodOverride()); 


// using morgan to log requests to the console
app.use(morgan('dev'));

//SET SECRET KEY
//app.set('superSecret', config.JWT_SECRET_TOKEN); // secret variable

// Allow CORS
app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
		next();
            });
            

app.use('/api/v0/', routes);
    

app.get('/',function(req,res){
    res.send("viaEtrcuk Back End Services");
});

// MongoDB configuration
// Database connect options
var options = {
    replset: {
        socketOptions: {
            connectTimeoutMS: 30
        }
    },
    server: {
        poolSize: 3,
        logger: logger,
        auto_reconnect: true
    }
};

var connectWithRetry = function () {
    return mongoose.connect(configAuth.MONGO_SERVER_PATH, options, function (err) {
        if (err) {
            logger.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
};
connectWithRetry();

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    logger.info('Mongoose default connection open to ' + configAuth.MONGO_SERVER_PATH);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    logger.info(new verror(err, 'Mongoose default connection error'));
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose default connection disconnected');
//  connectWithRetry();
});

// When the connection is reconnected
mongoose.connection.on('reconnected', function () {
    logger.info('Mongoose default connection reconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


require('./lib/passport')(passport); // pass passport for configuration

//auto restart if any exception found
 process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
  console.log(err.stack);
});




// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/authenticate.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.listen(configAuth.APP_PORT);

console.log("Port running on "+ configAuth.APP_PORT);


