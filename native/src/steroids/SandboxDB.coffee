restify = require "restify"
util = require "util"
yaml = require 'js-yaml'
Login = require "./Login"
q = require "q"
fs = require "fs"
URL = require "url"
http = require 'http'
open = require "open"
exec = require('child_process').exec
paths = require "./paths"
env = require("yeoman-generator")()
Help = require "./Help"
chalk = require "chalk"
dataHelpers = require "./dataHelpers"

data_definition_path = 'config/sandboxdb.yaml'

sandbox_db_base_url    = 'https://datastorage-api.appgyver.com'
sandbox_db_url         = "#{sandbox_db_base_url}/v1/datastorage"

class SandboxDB

  constructor: (@options={}) ->
    @sandboxDBProvisionApi = restify.createJsonClient
      url: sandbox_db_base_url
    @sandboxDBProvisionApi.basicAuth Login.currentAccessToken(), 'X'

  createBucketWithCredentials: () =>
    deferred = q.defer()
    data =
      appId: dataHelpers.getAppId()

    @sandboxDBProvisionApi.post('/v1/credentials/provision', { data: data }, (err, req, res, obj) =>
      if obj.code==201
        deferred.resolve(obj.body)
      else
        deferred.reject(obj)
    )

    return deferred.promise

  createSandboxDBConfig: (apikey, database, bucket_id) =>
    deferred = q.defer()

    doc =
      apikey: apikey
      bucket: database
      bucket_id: bucket_id

    steroidsCli.debug "Updating SandboxDB config..."

    dataHelpers.overwriteYamlConfig(data_definition_path, doc).then( ->
      steroidsCli.debug "Done updating SandboxDB config."
      deferred.resolve()
    ).fail ->
      deferred.reject "Could not update SandboxDB config."

    return deferred.promise

module.exports = SandboxDB

