/*
 * handle api endpoints.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    _ = require('underscore'),
    MongorillaCollection = require('../../models/helpers/collection').MongorillaCollection;


exports.get = function (req, res) {
    var objectId = req.route.params.objectId,
        collection = MongorillaCollection.getByRouterParams(req, res);

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    if ('default' === objectId) {
        res.send(collection.backboneForms.defaults||{});
    } else {
        getModel(collection.name)
            .findOne({ _id: objectId })
            .populate(_(collection.relations).keys().join(' '))
            .exec()
            .then(function (data) {
                res.send(data);
            })
            .reject(function () {
                res.send(arguments);
            });
    }
};

exports.post = function (req, res) {
    var objectId = req.route.params.objectId,
        collection = MongorillaCollection.getByRouterParams(req, res),
        url = require('url'),
        url_parts = url.parse(req.url, true),
        description = url_parts.query.description || '';

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    var attributes = _.clone(req.body);
    var responseData = _.clone(attributes);

    _(collection.relations).each(function (data, relKey) {
        if (_.isArray(req.body[relKey]) && req.body[relKey].length) {
            attributes[relKey] = _(req.body[relKey]).map(function (val, key) {
                if ('string' === typeof val ) {
                    return val;
                }
                return val['_id'] ? val['_id'].toString() : '';
            });
            if (0 === attributes[relKey].length) {
                delete attributes[relKey];
            }
        } else if (_.isObject(req.body[relKey]) && req.body[relKey]['_id']) {
            attributes[relKey] = req.body[relKey]['_id'].toString();
        }
    });

    delete attributes['_id'];

    // TODO skip all attributes not specified in schema
    var attributesToSet = global.helpers.toFlat(attributes);

    var model = new getModel(collection.name)();
    model.set(attributesToSet);
    model.set(collection.createdField.key, new global[collection.createdField.type||'Date']());
    model.set(collection.updatedField.key, new global[collection.createdField.type||'Date']());
    model.save(function (err, model) {
        if (err) {
            res.send(err);
        } else {
            var responseData = model.toObject();
            delete responseData.__v;

            if (collection.revisionable) {
                require('../../models/revision').saveRevisionSnapshot(collection, model._id, description, req.session.user, true, function (err, revision) {
                    res.send(responseData);
                });
            } else {
                res.send(responseData);
            }
        }
    });
};

exports.put = function (req, res) {
    var objectId = req.route.params.objectId,
        collection = MongorillaCollection.getByRouterParams(req, res),
        url = require('url'),
        url_parts = url.parse(req.url, true),
        description = url_parts.query.description || '';

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    var attributes = _.clone(req.body);
    var responseData = _.clone(attributes);

    _(collection.relations).each(function (data, relKey) {
        if (_.isArray(req.body[relKey]) && req.body[relKey].length) {
            attributes[relKey] = _(req.body[relKey]).map(function (val, key) {
                if ('string' === typeof val ) {
                    return val;
                }
                return val['_id'] ? val['_id'].toString() : '';
            });
            if (0 === attributes[relKey].length) {
                delete attributes[relKey];
            }
        } else if (_.isObject(req.body[relKey]) && req.body[relKey]['_id']) {
            attributes[relKey] = req.body[relKey]['_id'].toString();
        }
    });

    delete attributes['_id'];

    // TODO skip all attributes not specified in schema
    //var attributesToSet = global.helpers.toFlat(attributes);
    var attributesToSet = global.helpers.deepClone(attributes);
    attributesToSet[collection.updatedField.key] = new global[collection.createdField.type||'Date']().toISOString();


    // @see https://github.com/LearnBoost/mongoose/issues/964
    getModel(collection.name)
        .findById(objectId, function (err, model) {
            if (err) {
                res.send(err);
            } else {
                _.extend(model, attributesToSet);
                model.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else if (collection.revisionable) {
                        require('../../models/revision').saveRevisionSnapshot(collection, objectId, description, req.session.user, false, function (err, revision) {
                            res.send(responseData);
                        });
                    } else {
                        res.send(responseData);
                    }
                });
            }
        });

};

exports.del = function (req, res) {
    var objectId = req.route.params.objectId,
        collection = getCollection(req, res);

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    // TODO ACL for this
    getModel(collection.name)
        .findByIdAndRemove(objectId, function (err, model) {
            if (err) {
                res.send(err);
            } else {
                res.send(model);
            }
        });
};

exports.getSearch = function (req, res) {
    var url = require('url'),
        url_parts = url.parse(req.url, true),
        q = (url_parts.query.q||'').sanitize().makeSafeForRegex(),
        collection = MongorillaCollection.getByRouterParams(req, res);

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    var columnsHumanNames = _(collection.fastSearch.columns).map(function (col) {
        if (collection.backboneForms.schema[col]) {
            return collection.backboneForms.schema[col].title || col;
        }
        return col;
    });

    var findParams = global.helpers.toJS(global.helpers.deepClone(collection.fastSearch.find), function (arg) {
        return arg.replace(/\$\{q\}/g, q);
    });
    //findParams.uri = "comp";
    console.log('Session', res.locals.sessionUser);
    console.log('Roles', global.config.roles);

    var userRoles = res.locals.sessionUser.roles;
    var roles = global.config.roles;
    for (var i = userRoles.length - 1; i >= 0; i--) {
        userRole = userRoles[i];
        _.each(roles, function(role) {
            console.log(userRole, role.name);
            if(userRole == role.name && role.scope && role.scope[collection.name]) {
                console.log('Name Match with scope for this collection', userRole, role.name);
                _.each(role.scope[collection.name], function(scope, key) {
                    findParams[key] = scope;
                });
            }
        });
    };
    //findParams['$or'] = [ { 'uri': 'comp' }, { 'uri': 'erser' } ];
    console.log("FindParams", findParams);


    getModel(collection.name)
        .find(findParams, collection.fastSearch.columns.join(' ') + ' ' + collection.toStringField)
        .sort(collection.fastSearch.sort)
        .limit(collection.fastSearch.limit)
        .exec()
        .then(function (results) {
            res.send({
                collectionName: collection.name,
                q: q,
                columns: collection.fastSearch.columns,
                columnsHumanNames: columnsHumanNames,
                data: results
            });
        });
};

exports.getList = function (req, res) {
    var pager = require('../../helpers/pager'),
        collection = MongorillaCollection.getByRouterParams(req, res);

    if (!collection || !collection.isSessionUserAllowedToRoute(req, res)) {
        return;
    }

    var router = new pager.GetListRouter(req, res, getModel(collection.name), {
        populate: _(collection.relations).keys()
    });
    router.send();
};
