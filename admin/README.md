## Mongorilla is a simple and powerful CMS for MongoDB - Shoptology version

[![Build Status](https://travis-ci.org/gerardobort/mongorilla.svg?branch=master)](https://travis-ci.org/gerardobort/mongorilla)

Check the [Live demo!](http://mongorilla.herokuapp.com)


## Why Mongorilla
Mongoorilla let you define your Mongo Documnets schemas by simply editing a [JSON config file](https://github.com/gerardobort/mongorilla/blob/master/config/default.json).
Once you have the JSON setup, It will generate (on the fly) the administrator views and forms, including dashboards and search tools.
The principle of Mongorilla is to store your documents *as you defined* directly in MongoDB.  This means *no extra metadata embed on your documents*.  You define the documents structure as you want!

## Dependencies
Mongorilla is a NodeJS application, distributed via NPM which also have both: NPM and Bower dependencies.  The application is built on top of:
* Express3
* Mongoose
* BackboneJS
* Backbone-Forms in combination with Backbone-Deep-Model
* Bootstrap3

## Key features
* Support for multidimentional documents and/with ObjectId document references.
* Support for File/Image uploads against the same MongoDB using GridFS, and/or Amazon S3 buckets.
* Supports rich content, CKEditor come out of the box.
* Revisioning - You can rollback document revisions very easily, by navigating an edition tmieline!
* Customizing Mongorilla from the source code is not as terrible as in other CMSs.  Even tweaking forms, you can create your own editors, create backend hooks and even, re-use the REST API to serve the content to your frontend app.

## Configuration

### Role-based Filters
You can now add filtered views for collections based on the user's role.  Here is an example using the ``scope`` parameter underneath the user in ``default.json``:

```
{
    "name": "admin",
    "permissions": {
        "developer": "crud",
        "company": "crud",
    },
    "scope": {
        "company": { 
            "$or": [ { "name": "Test" }, { "uri": "test" } ] 
        }
    }
}
```

This will only show items in the search view that pass this mongo query filter.

##Installation

### Using Git
1. Clone this repository: ``$ git clone https://github.com/gerardobort/mongorilla.git``
2. Install the dependencies: (once in the repository folder) ``$ npm install``
3. Setup your MongoDB connection: ``$ export MONGORILLA_MONGO_URL="mongodb://localhost/my_mongorilla"``
4. Run the server instance: ``$ nodejs server.js``
5. Enjoy!

### Deploy to Heroku
1. Clone this repository: ``$ git clone https://github.com/gerardobort/mongorilla.git`` (or follow the NPM steps)
2. Add your Heroku app remote: ``$ git remote add path-to@your-heroku-app.git``
3. Install one of the MongoDB Addons to your Heroku App (``$ heroku addons:add mongolab`` or ``heroku addons:add mongohq``).
4. Push to Heroku ``git push heroku``.
5. Enjoy!

### Using NPM
1. ``$ npm install mongorilla``
2. Setup your MongoDB connection: ``$ export MONGORILLA_MONGO_URL="mongodb://localhost/my_mongorilla"``
3. Run the server instance: ``$ nodejs node_modules/mongorilla/server.js``
4. Enjoy!

## Configuration

### Currently Supported Schema Types
* Text
* TextArea
* Number
* Object
* List
* Date
* Datepicker
* DateTime
* Colorpicker
* File
* Image
* Checkboxes

### Building Custom Schema Types (Editors)

Here are the steps to building your own custom editors:

1. Duplicate or create a new editor file at `public/backbone-forms/editors`
2. Add require paths to your editor file at these locations:
    * `public/init.js`
    * `public/views/generic/form.js`
3. Add the correct Mongoose property to the switch statement in `models/generic.js`
4. Add a field to your JSON schema with the type property named after your editor
5. Build out your functionality!


## Dependent Fields

Dependent fields allow you to show or hide form elements based on a set of rules you define. 
This can be because it allows you to surface or remove certain inputs as they are, or are not, needed for completion of your form.

Currently, simple (on/off) dependent fields are supported.  

To use this feature you need to apply some attributes to the dependent field's schema.  
The object is formatted like this:  

	"yourDependentField" : {  
		...  
		"depends" : {  
			"nameOfParentField" : {  
				"value" : "action"  
			}  
		}  
	}  

The "value" key should match the value you want the parent to have in order to apply the "action" to the child form. "*" is supported as a wildcard to match any non-empty value.

The "action" value currently supports "show" and "hide".  
Forms with the "show" action start off hidden.  
Forms with the "hide" action start off visible.

## Roadmap
* Improve documentation
* Make all the configuration (schemas and users) be editable from the same admin panel.

:monkey_face:  :hamburger:
