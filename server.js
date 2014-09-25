/**
* Sample API build using Swagger by Wordnik, based loosly on their 
* swagger-node-express example at https://github.com/wordnik/swagger-node-express
*
* @author Dan Giulvezan
*
* @requires express 		Routing module
* @requires url 			Allows the URL to be read
* @requires fs 				Provides access to the servers file system
* @requires colors			Lets the app show colored output in the console window
* @requires swagger 		Generates the API docs dynamically
* @requires express-extras 	Adds additional middleware options to express; used for throttling
*
* @uses config.js
* @uses api.js
* @uses models/*
*
* @beta
*/

try {
	var express = require("express"),
		url = require("url"),
		fs = require('fs'),
		color = require('colors'),
		swagger = require("./Common/node/swagger.js"),
		extras = require('express-extras'),
		mongoose = require('mongoose'),
		config = require('./config'),
		db = mongoose.connection,
		bodyParser = require('body-parser');
} catch(err) {
	var msg = '\nCannot initialize API\n' + err + '\n';
	return console.log(msg.red);
};

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/**
 * MongoDB Connection
 */
db.on('error', function() {
	console.log('Database connection error'.red);
});
db.on('connecting', function () {
	console.log('Database connecting'.cyan);
});
db.once('open', function() {
	console.log('Database connection established'.green);
});
db.on('reconnected', function () {
	console.log('Database reconnected'.green);
});

mongoose.connect(config.db_url, {server: {auto_reconnect: true}});


// Setup throttling to keep users from abusing the API
app.use(extras.throttle({
	urlCount: 100,
	urlSec: 1,
	holdTime: 10,
	whitelist: {
		'127.0.0.1': true,
		'0.0.0.0': true
	}
}));

// Set the main handler in swagger to the express app
swagger.setAppHandler(app);

// Find all of the model files in the 'models' folder and add the their definitions to swagger
// so it can be displayed in the docs
fs.readdir('models', function(err, list) {
	if (err) return done(err);

	if (list) {
		list.forEach(function(file) {
			file = 'models' + '/' + file;
			fs.stat(file, function(err, stat) {
				console.log('adding model def from ' + file);
				swagger.addModels( require('./' + file).def );
			});
		});
	};
});


/**
 * Resources
 */
var user = require('./resources/user.js');

/**
 * Add resource methods to Swagger
 */
swagger
	.addGet(user.getAllUsers)
	.addGet(user.getUserById)
	.addPost(user.addUser)
	.addPut(user.updateUser)
	.addDelete(user.deleteUser)


swagger.configureDeclaration("user", {
	description : "Gets user information",
	authorizations : ["oauth2"],
	produces: ["application/json"]
});

/*swagger.configureDeclaration("manufacturer", {
	description : "Operations about phone manufacturers",
	authorizations : ["oauth2"],
	produces: ["application/json"]
});*/

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `1234`.  All other HTTP ops are A-OK
swagger.addValidator(
	function validate(req, path, httpMethod) {
		//  example, only allow POST for api_key="special-key"
		if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
			var apiKey = req.headers["api_key"];
			if (!apiKey) {
				apiKey = url.parse(req.url,true).query["api_key"];
			}
			if ("1234" == apiKey) {
				return true; 
			}
			return false;
		}
		return true;
	}
);

// set api info
swagger.setApiInfo({
	title: "Swagger sample app for looking at basic user data",
	description: "This is a sample API for a small database of users. For this sample, you can use the api key \"1234\" to test the authorization filters",
	termsOfServiceUrl: "",
	contact: "info@goshoptology.com",
	//license: "Apache 2.0",
	//licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
	apiKey: {
		type: "apiKey",
		passAs: "header"
	}
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://localhost:8002", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
	if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
		res.writeHead(302, { 'Location' : req.url + '/' });
		res.end();
		return;
	}
	// take off leading /docs so that connect locates file correctly
	req.url = req.url.substr('/docs'.length);
	return docs_handler(req, res, next);
});

// Start the server on port 8002
app.listen(8002);