paths = require "./paths"

env = require("yeoman-generator")()

q = require "q"

class ProjectCreator

  constructor: ->

  generate: (targetDirectory) ->

    deferred = q.defer()

    env.plugins "node_modules", paths.npm
    env.lookup '*:*'
    env.run "steroids:app #{targetDirectory}", {"skip-install": false}, deferred.resolve

    return deferred.promise

module.exports = ProjectCreator
