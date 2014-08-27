'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

var hbs = require('hbs');
var glob = require('glob');
var fs = require('fs');

// Handlebars helpers
var helpers = require('./app/lib/helpers.js');

/**
 * API keys and Passport configuration.
 */

var dotenv = require('dotenv');
dotenv.load();

var secrets = require('./app/config/secrets');
var passportConf = require('./app/config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'hbs');

/**
 * Dev settings
 */
if(process.env.NODE_ENV === 'dev') {

    /**
     * Get Local IP for browserify
     */

    var os=require('os');
    var ifaces=os.networkInterfaces();
    var localIpAddress = null;
    for (var dev in ifaces) {
        if(dev !== "en1" && dev !== "en0") {
            continue;
        }
        ifaces[dev].forEach(function(details){
            if (details.family==='IPv4') {
                localIpAddress = details.address;
            }
        });
    }

    var dev = {
        livereload : process.env.livereload ? process.env.livereload : true,
        browsersync : process.env.browsersync ? process.env.browsersync : true,
        localIpAddress : localIpAddress
    };
}


app.use(compress());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized : true,
    secret: secrets.sessionSecret,
    store: new MongoStore({
        url: secrets.db,
        auto_reconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
    if (_.contains(csrfExclude, req.path)) {
        return next();
    }
    csrf(req, res, next);
});
app.use(function(req, res, next) {
    // Make user object available in templates.
    res.locals.user = req.user;
    res.locals.dev = dev;
    next();
});
app.use(function(req, res, next) {
    // Remember original destination before login.
    var path = req.path.split('/')[1];
    if (/auth|login|logout|signup|img|fonts|favicon/i.test(path)) {
        return next();
    }
    req.session.returnTo = req.path;
    next();
});
app.use(express.static(path.join(__dirname, 'app/public'), { maxAge: week }));

/**
 * Routes.
 */

require('./app/config/routes')(app, passport, passportConf);



/**
 * 500 Error Handler.
 */

app.use(errorHandler());


/**
 * Find all the patterns in our patterns directory and register with Handlebars
 */

var files = glob.sync("./app/patterns/**/*.hbs"), partials = {};
files.forEach(function(filename) {
    var name = filename.match(/[^\/]+[.+\.].*$/, '');
    name = name[0].replace(/\.hbs$/, '');
    //console.log('Registering: '+name);
    hbs.registerPartial(name, fs.readFileSync(filename, 'utf8'));
});

/**
 * Register Handlebars helpers
 */

helpers.register();


/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
