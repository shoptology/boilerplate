restify = require "restify"
util = require "util"
yaml = require 'js-yaml'
Login = require "./Login"
SandboxDB = require "./SandboxDB"
SandboxScaffoldGenerator = require "./generators/sandbox/SandboxScaffold"
q = require "q"
fs = require "fs"
http = require 'http'
paths = require "./paths"
env = require("yeoman-generator")()
Help = require "./Help"
chalk = require "chalk"
dataHelpers = require "./dataHelpers"

data_definition_path = 'config/sandboxdb.yaml'
raml_path            = 'www/cloud.raml'
cloud_json_path      = 'config/cloud.json'
configapi_url        = 'https://config-api.appgyver.com'

class Providers
  constructor: (@options={}) ->
    @config_api = restify.createJsonClient
      url: configapi_url
    @config_api.headers["Authorization"] = Login.currentAccessToken()

  listProviders: () =>
    console.log "Fetching all providers...\n"
    @config_api.get('/available_service_providers.json', (err, req, res, obj) =>
      if err?
        Help.connectError "Could not fetch list of available providers."
      else
        console.log "Available providers:\n"
        obj.forEach (provider) ->
          console.log "  #{provider.human_name}"
        console.log ""
      @config_api.close()
    )

  initDatabase: (provider_name = 'appgyver_sandbox') =>
    deferred = q.defer()

    self = this

    initResource = (provider) ->
      self.initResourceProvider(provider).then( ->
        deferred.resolve provider
      ).fail (err)->
        deferred.reject err

    @getProviderByName(provider_name).then(
      (provider) =>
        console.log "SandboxDB provider was already created."
        initResource(provider)
        # TODO: deside what to do with empty provider
      (error) =>
        console.log "SandboxDB provider not found."
        self.addProvider(provider_name).then( (provider)->
          # What to do when successfully added
          initResource(provider)
        ).fail (err)->
          # What to do if adding a provider failed
          deferred.reject err
    )
    deferred.promise

  # Temporary method for removing the database
  removeDatabase: () ->
    console.log "Resetting your Steroids Data databases..."
    @removeProvider("appgyver_sandbox").then( ->

      console.log "Removing #{chalk.bold('config/sandboxdb.yaml')}..."
      dataHelpers.removeYamlConfig(data_definition_path)
    ).then( ->
      Help.SUCCESS()
      console.log(
        """
        All done! To reinitialize your Steroids Data database,
        please run

          #{chalk.bold("$ steroids data init")}

        """
      )
    ).fail (err) ->
      Help.error()
      console.log err


  addProvider: (provider_name, data) =>
    deferred = q.defer()

    console.log "Adding a provider..."

    data = data || @_getDefaultProviderData(provider_name)
    url = "/app/#{dataHelpers.getAppId()}/service_providers.json"

    @config_api.post url, data, (err, req, res, obj) =>
      if obj['uid']
        console.log "Provider successfully added!"
        deferred.resolve obj
      else
        deferred.reject err

      @config_api.close()

    deferred.promise


  _getDefaultProviderData: (provider_name) =>
    return {
      providerTypeId: 6    # appgyver_sandbox id specified in config api
      name: provider_name
    }

  removeProvider: (provider_name) =>
    deferred = q.defer()

    console.log "Removing SandboxDB provider..."

    @getProviderByName(provider_name).then( (provider) =>

      url = "/app/#{dataHelpers.getAppId()}/service_providers/#{provider.uid}.json"

      @config_api.del(url, (err, req, res, obj) =>
        console.log "Provider was successfully removed."
        @config_api.close()
        deferred.resolve()
      )
    ).fail (err)->
      deferred.reject err

    deferred.promise

  initResourceProvider: (provider) =>

    deferred = q.defer()

    console.log "Provisioning a SandboxDB database for your app..."

    unless provider?
      deferred.reject "Resource provider not specified."

    if resourceProviderInitialized(provider.name)
      console.log(
        """
        SandboxDB database already provisioned and configured at

          #{chalk.bold("config/sandboxdb.yaml")}

        All good!
        """
      )
      deferred.resolve()
    else

      sandboxDB = new SandboxDB
      sandboxDB.createBucketWithCredentials().then(
        (bucket) =>
          console.log "Database provisioned, creating a local config file..."
          sandboxDB.createSandboxDBConfig("#{bucket.login}#{bucket.password}", bucket.name, bucket.datastore_bucket_id)
      ).then( (data) =>
        console.log "Local config file created at #{chalk.bold("config/sandboxdb.yaml")}"
        @updateProviderInfo(provider).then ()->
          deferred.resolve()
      ).fail (error) =>
        deferred.reject error

    deferred.promise

  getResourceObjectByName: (resource_name) =>
    deferred = q.defer()
    @getProviderByName('appgyver_sandbox').then (provider) =>

      url = "/app/#{dataHelpers.getAppId()}/service_providers/#{provider.uid}/resources.json"

      @config_api.get(url, (err, req, res, obj) =>
        if err?
          deferred.reject(err)

        @config_api.close()

        obj.forEach (resourceFromBackend) =>
          if resourceFromBackend.name == resource_name
            deferred.resolve resourceFromBackend

        deferred.reject "Could not find resource #{chalk.bold(resource_name)} in your SandboxDB."
      )

    deferred.promise

  removeResource: (resource_to_be_removed) =>
    deferred = q.defer()

    console.log "Removing resource #{chalk.bold(resource_to_be_removed)}..."
    # should loop through all providers?
    @getResourceObjectByName(resource_to_be_removed).then( (resourceObject) =>

      url = "/app/#{dataHelpers.getAppId()}/service_providers/#{resourceObject.serviceProviderUid}/resources/#{resourceObject.uid}.json"
      @config_api.del url, (err, req, res, obj) =>
        @config_api.close()

        if err?
          deferred.reject "Could not remove resource #{resourceObject.name}."

        console.log "Done."
        deferred.resolve()

    ).fail (error)=>
      Help.error()
      console.log error

    deferred.promise

  resourcesForSandbox: () =>
    console.log "Fetching list of resources for your SandboxDB..."
    @getProviderByName('appgyver_sandbox').then (provider) =>
      @config_api.get("/app/#{dataHelpers.getAppId()}/service_providers/#{provider.uid}/resources.json", (err, req, res, obj) =>
        if err?
          Help.error()
          console.log(
            """
            Could not fetch list of resources for your SandboxDB. Ensure that
            you've set up your SandboxDB for this app with

              #{chalk.bold("$ steroids resources:init")}

            """
          )
        else if obj.length is 0
          Help.error()
          console.log(
            """
            No resources found for your app. You can add resources
            with the command:

              #{chalk.bold("$ steroids resources:add resourceName")}

            """
          )
        else
          console.log "Resources for your app: \n\n"
          obj.forEach (resource)->
            console.log "  #{resource.name}"
            resource.columns.forEach (column) ->
              console.log "    #{column.name}:#{column.type}"
        @config_api.close()
      )

  # only for SandboxDB, hardcoded provider_name
  addResource: (params) =>
    provider_name = "appgyver_sandbox"

    @getProviderByName(provider_name).then(
      (provider) =>
        resource_name = params.shift()

        console.log "Adding resource #{chalk.bold(resource_name)} to SandboxDB..."

        postData = createPostData(provider_name, resource_name, params)

        # TODO: Check that the method accepts provider.iud
        @askConfigApiToCreateResource(provider.uid, postData).then(
          () =>
            @saveRamlToFile()
          , (error) ->
            Help.error()
            console.log "Could not add resource #{chalk.bold(resource_name)}. Error: #{error}"
        )
      (error) =>
        errorObject = JSON.parse(error)
        Help.error()
        console.log "\nCould not add resource: #{errorObject.error}"
    )

  scaffoldResource: (resource_name) =>
    deferred = q.defer()

    console.log "Creating a scaffold for resource #{chalk.bold(resource_name)}..."
    @getResourceObjectByName(resource_name).then((resourceObject)=>
      console.log "Got resource from backend..."
      @generateScaffoldForResource resourceObject
    ).fail (error)=>
      deferred.reject(error)

    deferred.promise


  generateScaffoldForResource: (resource)->
    columns = resource.columns.map (column) -> column.name
    args = "#{resource.name} #{columns.join(' ')}"

    generator = new SandboxScaffoldGenerator {args: args}

    try
      generator.generate()
    catch error
      throw error unless error.fromSteroids?

  # mostly for debugging
  listMyProviders: () =>
    @config_api.get("/app/#{dataHelpers.getAppId()}/service_providers.json", (err, req, res, obj) =>
      if obj.length==0
        console.log 'no providers defined'
      else
        obj.forEach (provider) ->
          console.log provider
      @config_api.close()
    )

  # helpers

  updateProviderInfo: (provider) =>
    deferred = q.defer()
    config = getConfig()

    data = provider

    unless data.configurationKeys?
      data.configurationKeys =
        bucket_id: config['bucket_id']
        steroids_api_key: config['apikey']
        bucket_name: config['bucket']

    console.log "Updating SandboxDB data provider information..."

    @config_api.put("/app/#{dataHelpers.getAppId()}/service_providers/#{provider.uid}.json", data, (err, req, res, obj) =>
      console.log 'SandboxDB data provider information was updated.'
      deferred.resolve()
      @config_api.close()
      # restify does not close...
      # TODO: dig into exiting process
      #process.exit 1
    )

    deferred.promise

  saveRamlToFile: () =>
    @config_api.headers["Accept"] = "text/yaml"
    url = "/app/#{dataHelpers.getAppId()}/raml?identification_hash=#{dataHelpers.getIdentificationHash()}"

    console.log "Downloading new RAML and overwriting #{chalk.bold(raml_path)}..."

    @config_api.get(url, (err, req, res, obj) =>
      @config_api.close()

      dataHelpers.overwriteFile(raml_path, res['body']).then ->
        console.log "Done."
    )

  askConfigApiToCreateResource: (provider, postData) =>
    deferred = q.defer()

    url = "/app/#{dataHelpers.getAppId()}/service_providers/#{provider}/resources.json"

    @config_api.post(url, postData, (err, req, res, obj) =>
      @config_api.close()
      if err?
        deferred.reject(err.body[0])
      else if noServiceProvider(err)
        deferred.reject("Service provider is not defined.")
      else
        console.log "Done."
        deferred.resolve()
    )

    return deferred.promise

  providerExists = (name) ->
    if fs.existsSync(data_definition_path)
      getProviderByName(name)?
    else
      false

  resourceProviderInitialized = (name) ->
    return false unless fs.existsSync(data_definition_path)
    config = getConfig()
    config.bucket_id?

  # only gets appgyver_sandbox provider
  getProviderByName: (name) ->
    deferred = q.defer()

    @config_api.get("/app/#{dataHelpers.getAppId()}/service_providers.json", (err, req, res, obj) =>
      @config_api.close()
      if err?
        deferred.reject(err.message)
      else
        obj.forEach (provider) ->
          if (name == "appgyver_sandbox" and provider.providerTypeId==6)
            deferred.resolve provider

        errorMsg =
          """
          Could not find the SandboxDB data provider for your app. Please run

            #{chalk.bold("$ steroids data init")}

          which will ensure the SandboxDB data provider is set up correctly.

          """
        deferred.reject errorMsg
    )

    return deferred.promise

  createPostData = (provider_name, resource_name, params) ->
    config = getConfig()
    bucket = config.bucket

    validateName(resource_name)

    data =
      name: resource_name
      path: bucket+'/'+resource_name
      columns: []

    if params.length==0
      console.log "A resource should have at least one column."
      process.exit 1

    params.forEach (column) ->
      validateColumn(column)
      [_name, _type] = column.split(':')
      data.columns.push { name:_name, type:_type}

    data

  getConfig = () ->
    yaml.safeLoad readConfigFromFile()

  readConfigFromFile = () ->
    try return fs.readFileSync(data_definition_path, 'utf8')
    catch e
      Help.error()
      console.log(
        """
        Could not read file #{chalk.bold("config/sandboxdb.yaml")}. You must
        initialize your SandboxDB with

          #{chalk.bold("$ steroids data init")}

        """
      )
      process.exit 1


  validateName = (string) ->
    valid = /^[a-z_]*$/
    return true if string.match valid

    Help.error()
    console.log "Only lowcase alphabets and underscores allowed: '#{string}'"
    process.exit 1

  validateColumn = (string) ->
    parts = string.split(':')
    unless parts.length==2
      Help.error()
      console.log(
        """
        Illegal column definition: #{chalk.bold(string)}

        Columns must be of format: #{chalk.bold("columnName:columnType")}
        """
      )
      process.exit 1
    validateName parts[0]
    validateType parts[1]

  validateType = (string) ->
    allowed = ["string", "integer", "boolean", "number", "date"]
    return true if string in allowed

    Help.error()
    console.log(
      """
      Invalid column type #{chalk.bold(string)}.

      Allowed column types: #{allowed.join(', ')}
      """
    )
    process.exit 1

  noServiceProvider = (err) ->
    return false unless err?
    JSON.parse(err.message).error == 'service provider not found'

module.exports = Providers
