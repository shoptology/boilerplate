/**
* The schema and model for user data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	id: Number,
	name: String,
	email: String
});

exports.def =  
	{
		"User":{
			"id":"User",
			"required": ["id", "name", "email"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "User unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
				"name":{
					"type":"string",
					"description": "User's name"
				},
				"email":{
					"type":"string",
					"description": "User's email address"
				}
			}
		}
	};


// Don't create model if model is exists
if(!mongoose.modelSchemas.users) {
	exports.model = mongoose.model('users', userSchema);
} else {
	exports.model = '';
}
