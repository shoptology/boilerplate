*Heads up: This repo's a work in progress, so expect it to change while the idea is flushed out more*

### What is this

This is a rather simple example of an API that can do CRUD operations on documents stored in a MongoDB database.

This code started out as Wordnik's [swagger-node-express](https://github.com/wordnik/swagger-node-express) example, but it's been changed so much that it doesn't make sense to just call it a fork of that repo. Speaking of that swagger-node-express repo, if you're looking for a good place to get started learning about creating an API with Swagger, that's a great project to take a look at.

### What's needed

This API runs on node.js, and makes use of the following:

- [Express](https://github.com/visionmedia/express) - node.js framework that handles routing
- [ExpressJS Extras](https://github.com/davglass/express-extras) - An add-on to Express that's used to add support for throttling
- [MongoDB](http://mongodb.com) - NoSQL database that holds our data
- [Mongoose](http://mongoosejs.com/) - ODM (object data mapping) layer, translates your data into JavaScript objects so you can work with them easier
- [Swagger UI](https://github.com/wordnik/swagger-ui) - Framework to help describe, produce, and test a RESTful web service


### The data

This project assumes that data is stored in a MongoDB database. Basically, you'll need one collection:

- users

Add the data below to each of those:

```
users:

[
  {
    "_id": "52b0d4cce4b01af504503c80",
    "name": "John Doe",
    "email": "john@doe.com"
  },
  {
    "_id": "52b0d4d9e4b01af504503c81",
    "name": "Jane Doe",
    "email": "jane@doe.com"
  }
]
```


### Getting started with the API

Clone this projet (or download the zip file), then run ```npm install``` to install the dependencies.

Next you'll want to create your own "config.js" file. There's a file in the project called "config-sample.js" that you can copy to "config.js", and modify it to include the connection string to your database.

The file will look like the one below. Just replace the dummy connection string with the real one you'll be using.


```
/**
* Config file for the API
*/
exports.db_url = 'mongodb://username:password@your-mongo-host.com/database-name';

```

Now, startup up server with the command `node server.js`, and you should see the messages below:

	Database connecting
	adding model def from models/carrier.js
	adding model def from models/manufacturer.js
	adding model def from models/phone.js
	Database connection established

If you don't see those messages, double check the connection string to your database in your config file, and make sure the file is called "config.js" and not "config-sample.js".


#### Have fun

At this point your API should be running and you can start testing it out. Thankfully, swagger-ui makes it really easy to start playing around with your API by automatically generating your API docs, and it even gives you the ability to test each of your methods without having to write your own code.

To see your API docs, just go to [http://localhost:8002/docs](http://localhost:8002/docs).

#### Known issues

Nothing right this moment, but I'm sure some problems are in there, I just haven't caught them yet. :)