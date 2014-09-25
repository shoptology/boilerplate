var sw = require("../Common/node/swagger.js"),
	param = require("../Common/node/paramTypes.js"),
	swe = sw.errors,
	User = require('../models/user.js');

/**
* List methods
*/
exports.getAllUsers = {
	'spec': {
		description : "List all phone users",
		path : "/user/list",
		method: "GET",
		summary : "List all phone users",
		notes : "Returns a list of all phone users",
		type : "User",
		nickname : "getAllUsers",
		produces : ["application/json"],
		parameters : [],
		responseMessages : [swe.invalid('users'), swe.notFound('users')]
	},
	'action': function (req,res) {
		User.model.find(function(err, users) {
			if (err) return next(swe.invalid('users'))

			if (users) {
				res.send(users);
			} else {
				res.send(404, swe.notFound('users'));
			};
		});
	}
};


/**
* Get record by ID methods
*/
exports.getUserById = {
	'spec': {
		description : "Operations about users",
		path : "/user/{userId}",
		method: "GET",
		summary : "Find user by ID",
		notes : "Returns a user based on ID",
		type : "User",
		nickname : "getUserById",
		produces : ["application/json"],
		parameters : [param.path("userId", "ID of the user to return", "string")],
		responseMessages : [swe.invalid('id'), swe.notFound('user')]
	},
	'action': function (req,res) {
		User.model.findOne({_id: req.params.userId}, function(err, user) {
			if (err) return res.send(404, { error: 'invalid id' });

			if (user) {
				res.send(user);
			} else {
				res.send(404, new Error('user not found'));
			}
		});
	}
};



/**
* Add/create methods
*/
exports.addUser = {
	'spec': {
		path : "/user",
		notes : "Adds a new user",
		summary : "Add a new user",
		method: "POST",
		parameters : [param.body("User name", "JSON object representing the user to add", "User")],
		responseMessages : [swe.invalid('input')],
		nickname : "addUser"
	},
	'action': function(req, res, next) {
		var body = req.body;
		if(!body || !body.name){
			throw swe.invalid('user name');
		} else {
			// Create the new document (database will be updated automatically)
			User.model.create({ name: body.name }, function (err, name) {
				if (err) return res.send(500, { error: err });

				if (name) {
					res.send(name);
				} else {
					res.send(500, { error: 'user not added' });
				};
			});
		}
	}
};


/**
* Update methods
*/
exports.updateUser = {
	'spec': {
		path : "/user",
		notes : "Update an existing user",
		summary : "Update an existing user",
		method: "PUT",
		//parameters : [param.body("User ID", "User ID to update", "User"), param.body("User name", "New user name", "User")],
		parameters : [
			param.query("id", "User ID to update", "string", true),
			param.query("name", "New user name to use", "string", true)
		],
		responseMessages : [swe.invalid('input')],
		type : "User",
		nickname : "updateUser"
	},
	'action': function(req, res, next) {
		var query = req.query;
		if(!query || !query.id) {
			throw swe.invalid('user id');
		} else if(!query || !query.name) {
			throw swe.invalid('user name');
		} else {
			// Update an existing document (database will be updated automatically)
			User.model.update({ _id : query.id }, { name: query.name }, function (err, numRowsAffected, raw) {
				if (err) return res.send(500, { error: err });

				if (numRowsAffected > 0) {
					res.send(raw);
				} else {
					res.send(500, { error: 'user not updated' });
				};
			});
		}
	}
};


/**
* Delete methods
*/
exports.deleteUser = {
	'spec': {
		path : "/user",
		notes : "Delete an existing user",
		summary : "Delete an existing user",
		method: "DELETE",
		parameters : [
			param.query("id", "User ID to delete", "string", true)
		],
		responseMessages : [swe.invalid('input')],
		type : "User",
		nickname : "updateUser"
	},
	'action': function(req, res, next) {
		var query = req.query;
		if(!query || !query.id) {
			throw swe.invalid('user id');
		} else {
			// Delete an existing document (database will be updated automatically)
			User.model.remove({ _id : query.id }, function (err) {
				if (err) return res.send(500, { error: err });

				res.send(200, { 'msg' : 'ok' });
			});
		}
	}
};