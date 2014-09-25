fs = require "fs"
path = require "path"
util = require "util"

restify = require "restify"
restler = require "restler"
async = require "async"
open = require "open"

paths = require "./paths"
DeployConverter = require "./DeployConverter"
Login = require "./Login"

Help = require "./Help"

CloudConfig = require "./CloudConfig"

class Deploy
  constructor: (@options={})->
    @cloudConfig = JSON.parse(fs.readFileSync(paths.application.configs.cloud, "utf8")) if fs.existsSync paths.application.configs.cloud

    @converter = new DeployConverter paths.application.configs.application

    ankaURL = steroidsCli.options.argv.ankaURL || "https://anka.appgyver.com"

    @client = restify.createJsonClient
      url: ankaURL

  uploadToCloud: (callback=->)->
    @client.basicAuth Login.currentAccessToken(), 'X'

    @uploadApplicationJSON ()=>
      @uploadApplicationZip ()=>
        @updateConfigurationFile(callback)

  uploadApplicationJSON: (callback)->
    # util.log "Updating application configuration"
    util.log "Uploading Application to cloud"

    @app = @converter.applicationCloudSchemaRepresentation()

    if fs.existsSync paths.application.configs.cloud
      # util.log "Application has been deployed before"
      cloudConfig = JSON.parse fs.readFileSync(paths.application.configs.cloud, 'utf8')
      @app.id = cloudConfig.id
      # util.log "Using cloud ID: #{cloudConfig.id}"

    # util.log "Uploading #{JSON.stringify(@app)}"

    requestData =
      application: @app

    restifyCallback = (err, req, res, obj)=>
      steroidsCli.debug "RECEIVED APPJSON SYNC RESPONSE"
      steroidsCli.debug "err: #{util.inspect(err)}"
      steroidsCli.debug "req: #{util.inspect(req)}"
      steroidsCli.debug "res: #{util.inspect(res)}"
      steroidsCli.debug "obj: #{util.inspect(obj)}"

      unless err
        # util.log "RECEIVED APPJSON SYNC SUCCESS"
        @cloudApp = obj
        callback()
      else
        # util.log "RECEIVED APPJSON SYNC FAILURE"
        # util.log "err: #{util.inspect(err)}"
        # util.log "obj: #{util.inspect(obj)}"
        Help.error()
        console.log "Failed with error: #{err.body.error}."
        console.log "Check that you have correct app id in config/cloud.json. Try removing the file and a new cloud.json file will be created."
        process.exit 1

    if @app.id?
      steroidsCli.debug "Updating existing app with id #{@app.id}"
      # util.log "PUT"
      @client.put "/studio_api/applications/#{@app.id}", requestData, restifyCallback
    else
      steroidsCli.debug "Creating new app"
      # util.log "POST"
      @client.post "/studio_api/applications", requestData, restifyCallback

  uploadApplicationZip: (callback)->
    sourcePath = paths.temporaryZip
    # util.log "Updating application build from #{sourcePath} to #{@cloudApp.custom_code_zip_upload_url}"
    # util.log "key #{@cloudApp.custom_code_zip_upload_key}"

    params =
      success_action_status: "201"
      utf8: ""
      key: @cloudApp.custom_code_zip_upload_key
      acl: @cloudApp.custom_code_zip_upload_acl
      policy: @cloudApp.custom_code_zip_upload_policy
      signature: @cloudApp.custom_code_zip_upload_signature
      AWSAccessKeyId: @cloudApp.custom_code_zip_upload_access_key
      file: restler.file(
        sourcePath, # source path
        "custom_code.zip", # filename
        fs.statSync(sourcePath).size, # file size
        "binary", # file encoding
        'application/octet-stream') # file content type

    uploadRequest = restler.post @cloudApp.custom_code_zip_upload_url, { multipart: true, data:params }
    uploadRequest.on 'success', ()=>
      # util.log "Updated application build"
      callback()

  updateConfigurationFile: (callback)->
    # util.log "Updating #{paths.application.configs.cloud}"

    cloudConfig = new CloudConfig
      id: @cloudApp.id
      identification_hash: @cloudApp.identification_hash

    cloudConfig.saveSync()

    config = cloudConfig.getCurrentSync()

    util.log "Deployment complete"

    Help.deployCompleted()

    shareURL = steroidsCli.options.argv.shareURL || "https://share.appgyver.com"

    util.log "Opening URL #{shareURL}/?id=#{config.id}&hash=#{config.identification_hash} in default web browser...\n"
    open "#{shareURL}/?id=#{config.id}&hash=#{config.identification_hash}"

    callback()

module.exports = Deploy
