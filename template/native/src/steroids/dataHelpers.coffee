fs = require "fs"
Help = require "./Help"
Q = require "q"
yaml = require 'js-yaml'

module.exports = class DataHelpers

  # config/cloud.json stuff
  @getAppId: () ->
    @getFromCloudJson "id"

  @getIdentificationHash = ->
    @getFromCloudJson "identification_hash"

  @getFromCloudJson: (param) ->
    cloudJsonPath = "config/cloud.json"

    unless fs.existsSync(cloudJsonPath)
      Help.deployRequiredForData()
      process.exit 1

    cloudJson = fs.readFileSync cloudJsonPath, 'utf8'
    cloudObj = JSON.parse(cloudJson)
    return cloudObj[param]

  # RAML stuff
  @getLocalRaml: (localRamlPath) ->
    fs.readFileSync localRamlPath, 'utf8'

  # generic promisified file overwrite
  @overwriteFile: (filePath, fileContent) ->
    deferred = Q.defer()

    fs.writeFile filePath, fileContent, (err, data) ->
      if err?
        deferred.reject err
      else
        deferred.resolve data

    deferred.promise

  # YAML stuff
  @overwriteYamlConfig: (filePath, fileContent)->
    @overwriteFile filePath, yaml.safeDump(fileContent)

  @removeYamlConfig: (yamlPath) ->
    deferred = Q.defer()

    # If file doesn't exist, we don't need to remove it
    if !fs.existsSync yamlPath
      deferred.resolve()

    fs.unlink yamlPath, (err, data) ->
      if err?
        deferred.reject "Could not remove file at #{yamlPath}."
      else
        deferred.resolve()

    deferred.promise

