paths = require "./paths"
path = require "path"

class Version

  constructor: (@options = {})->
    @pathToPackageJSON = path.join paths.npm, "package.json"

  getVersion: =>
    steroidsCli.debug "requiring #{@pathToPackageJSON}"

    packageJSON = require @pathToPackageJSON
    steroidsCli.debug "package.json#version: #{packageJSON.version}"

    return packageJSON.version

  formattedVersion: =>
    return "AppGyver Steroids #{@getVersion()}"

module.exports = Version
