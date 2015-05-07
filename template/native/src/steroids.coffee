Help = require "./steroids/Help"
Weinre = require "./steroids/Weinre"
Simulator = require "./steroids/Simulator"
TizenWebSimulator = require "./steroids/TizenWebSimulator"

Project = require "./steroids/Project"
Updater = require "./steroids/Updater"
SafariDebug = require "./steroids/SafariDebug"
Serve = require "./steroids/Serve"
Server = require "./steroids/Server"
Ripple = require "./steroids/Ripple"
PortChecker = require "./steroids/PortChecker"

Providers = require "./steroids/Providers"
Data = require "./steroids/Data"

util = require "util"
Version = require "./steroids/Version"
paths = require "./steroids/paths"

Karma = require "./steroids/Karma"

argv = require('optimist').argv
open = require "open"

fs = require("fs")

Config = require "./steroids/Config"
Login = require "./steroids/Login"

chalk = require "chalk"

class Steroids

  simulator: null

  constructor: (@options = {}) ->
    @simulator = new Simulator
      debug: @options.debug

    @version = new Version
    @pathToSelf = process.argv[1]
    @config = new Config
    @platform = @options.argv.platform || "ios"

  readApplicationConfig: ->
    applicationConfig = paths.application.configs.application

    if fs.existsSync(applicationConfig)
      contents = fs.readFileSync(applicationConfig).toString()

    return contents

  detectSteroidsProject: ->
    return fs.existsSync(paths.application.configDir) and fs.existsSync(paths.application.wwwDir)

  debug: (options = {}) =>
    return unless steroidsCli.options.debug

    message = if options.constructor.name == "String"
      options
    else
      options.message

    console.log "[DEBUG]", message


  ensureProjectIfNeededFor: (command, otherOptions) ->
    if command in ["push", "make", "package", "grunt", "debug", "simulator", "connect", "update", "generate", "deploy", "test"]

      return if @detectSteroidsProject()
      return if command == "generate" and otherOptions.length == 0    # displays usage

      console.log """
        Error: command '#{command}' requires to be run in a Steroids project directory.
      """

      process.exit(1)

  execute: =>
    [firstOption, otherOptions...] = argv._

    if argv.version
      firstOption = "version"

    @weinrePort = if argv.weinrePort
      argv.weinrePort
    else
      31173


    @ensureProjectIfNeededFor(firstOption, otherOptions)

    if firstOption in ["connect", "create"]
      Help.logo() unless argv.noLogo

    if firstOption in ["connect", "deploy", "simulator"]
      unless Login.authTokenExists()
        console.log """

        You must be logged in, log in with:

        \t$ steroids login

        """
        process.exit 1

    switch firstOption

      when "data"
        if otherOptions[0] is "init"
          data = new Data
          data.init()

        else if otherOptions[0] is "reset"
          providers = new Providers
          providers.removeDatabase()

        else if otherOptions[0] is "resources:list"
          providers = new Providers
          providers.resourcesForSandbox()

        else if otherOptions[0] is "resources:add"
          otherOptions = otherOptions.slice(1)
          unless otherOptions?.length > 1
            console.log "Usage: steroids data resources:add <resourceName> <columnName>:<columnType>"
            process.exit 1

          providers = new Providers
          providers.addResource(otherOptions).fail (error) =>
            Help.error()
            console.log(
              """
              Could not add resource.

              Error message: #{error}
              """
            )

        else if otherOptions[0] is "resources:remove"
          otherOptions = otherOptions.slice(1)
          unless otherOptions?.length is 1
            console.log "Usage: steroids data resources:remove <resourceName>"
            process.exit 1

          providers = new Providers
          providers.removeResource(otherOptions[0]).fail (error)=>
            Help.error()
            console.log error

        else if otherOptions[0] is "manage"
          data = new Data
          data.manage()

        else if otherOptions[0] is "scaffold"
          otherOptions = otherOptions.slice(1)
          unless otherOptions?.length is 1
            console.log "Usage: steroids data scaffold <resourceName>"
            process.exit 1

          providers = new Providers
          providers.scaffoldResource(otherOptions[0]).fail (error)=>
            Help.error()
            console.log error

        else
          Help.dataUsage()

      when "version"
        updater = new Updater
          verbose: false

        updater.check
          from: "version"

        console.log @version.formattedVersion()

      when "create"

        folder = otherOptions[0]

        unless folder

          console.log "Usage: steroids create <directoryName>"

          process.exit(1)

        ProjectCreator = require("./steroids/ProjectCreator")
        projectCreator = new ProjectCreator
          debug: @options.debug

        projectCreator.generate(folder)


      when "push"
        project = new Project
        project.push
          onSuccess: ->
            steroidsCli.debug "steroids make && steroids package ok."

      when "make"
        project = new Project
        project.make()

      when "package"
        Packager = require "./steroids/Packager"

        packager = new Packager

        packager.create()

      when "grunt"

        task = if argv.task
          argv.task
        else
          "default"

        gruntfile = if argv.gruntfile
          argv.gruntfile


        # Grunt steals the whole node process ...
        Grunt = require("./steroids/Grunt")

        grunt = new Grunt
        grunt.run( { task: task, gruntfile: gruntfile } )

      when "debug"
        Help.legacy.debugweinre()

      when "weinre"
        @port = if argv.port
          argv.port
        else
          31173

        options = {}
        options.httpPort = @port

        weinre = new Weinre options
        weinre.run()

        project = new Project
        project.push
          onSuccess: () =>
            url = "http://127.0.0.1:#{weinre.options.httpPort}/client/#anonymous"
            steroidsCli.debug "pushed, opening browser to #{url}"
            open url


      when "simulator"
        if argv.type
          Help.legacy.simulatorType()
          process.exit(1)

        if argv.deviceType == "tizenweb"
          steroidsCli.platform = "tizen"

          servePort = if argv.port
            argv.port
          else
            4300

          tizenWebSimulator = new TizenWebSimulator servePort
          tizenWebSimulator.run()

          serve = new Serve servePort
          serve.start()

        else
          steroidsCli.simulator.run
            deviceType: argv.deviceType

      when "test"

        # steroids test karma
        if otherOptions[0] is "karma"
          karma = new Karma
            firstOption: otherOptions[1]
            webServerPort: argv.port
            qrcode: argv.qrcode
            simulator:
              use: argv.simulator
              deviceType: argv.deviceType

        else
          Help.usage()
          process.exit(1)

      when "connect"
        updater = new Updater
        updater.check
          from: "connect"

        @port = if argv.port
          argv.port
        else
          4567

        if argv.serve
          servePort = if argv.servePort
            argv.servePort
          else
            4000

          serve = new Serve servePort,
            platform: argv.platform
            noBrowser: argv.ripple

          serve.start()

        checker = new PortChecker
          port: @port
          autorun: true
          onOpen: ()=>
            console.log "Error: port #{@port} is already in use. Make sure there is no other program or that 'steroids connect' is not running on this port."
            process.exit(1)

          onClosed: ()=>
            project = new Project
            project.push
              onFailure: =>
                steroidsCli.debug "Cannot continue starting server, the push failed."
              onSuccess: =>
                BuildServer = require "./steroids/servers/BuildServer"

                Prompt = require("./steroids/Prompt")
                prompt = new Prompt
                  context: @

                server = Server.start
                  port: @port
                  callback: ()=>
                    global.steroidsCli.server = server

                    buildServer = new BuildServer
                                        path: "/"
                                        port: @port

                    server.mount(buildServer)

                    unless argv.qrcode is false
                      QRCode = require "./steroids/QRCode"
                      QRCode.showLocal
                        port: @port

                      util.log "Waiting for the client to connect, scan the QR code visible in your browser ..."

                    setInterval () ->
                      activeClients = 0;
                      needsRefresh = false

                      for ip, client of buildServer.clients
                        delta = Date.now() - client.lastSeen

                        if (delta > 2000)
                          needsRefresh = true
                          delete buildServer.clients[ip]
                          console.log ""
                          util.log "Client disconnected: #{client.ipAddress} - #{client.userAgent}"
                        else if client.new
                          needsRefresh = true
                          activeClients++
                          client.new = false

                          console.log ""
                          util.log "New client: #{client.ipAddress} - #{client.userAgent}"
                        else
                          activeClients++

                      if needsRefresh
                        util.log "Number of clients connected: #{activeClients}"
                        prompt.refresh()

                    , 1000


                    if argv.watch
                      steroidsCli.debug "Starting FS watcher"
                      Watcher = require("./steroids/fs/watcher")

                      pushAndPrompt = =>
                        console.log ""
                        util.log "File system change detected, pushing code to connected devices ..."

                        project = new Project
                        project.push
                          onSuccess: =>
                            prompt.refresh()
                          onFailure: =>
                            prompt.refresh()

                      if argv.watchExclude?
                        excludePaths = steroidsCli.config.getCurrent().watch.exclude.concat(argv.watchExclude.split(","))
                      else
                        excludePaths = steroidsCli.config.getCurrent().watch.exclude

                      watcher = new Watcher
                        excludePaths: excludePaths
                        onCreate: pushAndPrompt
                        onUpdate: pushAndPrompt
                        onDelete: (file) =>
                          steroidsCli.debug "Deleted watched file #{file}"

                      watcher.watch("./app")
                      watcher.watch("./www")
                      watcher.watch("./config")

                    prompt.connectLoop()

                    if argv.ripple
                      setTimeout =>
                        ripple = new Ripple
                          servePort: argv.servePort || 4000
                          port: argv.ripplePort

                        ripple.run()
                      , 2000





      when "serve"
        Help.legacy.serve()

      when "update"
        updater = new Updater
          verbose: false

        updater.check(
          from: "update"
        ).then( ->
          Npm = require "./steroids/Npm"
          npm = new Npm
          npm.install()
        ).then( ->
          Bower = require "./steroids/Bower"
          bower = new Bower
          bower.update()
        )

      when "generate"
        [generatorType, generatorArgs...] = otherOptions

        unless generatorType?
          Help.listGenerators()
          process.exit 0

        Generators = require "./steroids/Generators"

        generatorOptions =
          name: generatorArgs[0]
          otherOptions: generatorArgs

        unless Generators[generatorType]
          console.log "No such generator: #{generatorType}"
          process.exit(1)

        generator = new Generators[generatorType](generatorOptions)

        try
          generator.generate()
        catch error
          throw error unless error.fromSteroids?

          util.log "ERROR: #{error.message}"
          process.exit 1


      when "login"
        updater = new Updater
        updater.check
          from: "login"

        Help.logo()

        if Login.authTokenExists()
          util.log "Already logged in."
          return

        util.log "Starting login process"

        @port = if argv.port
          argv.port
        else
          13303

        server = Server.start
          port: @port
          callback: ()=>
            login = new Login
              server: server
              port: @port
            login.authorize()

      when "logout"
        Help.logo()

        unless Login.authTokenExists()
          util.log "Try logging in before you try logging out."
          return

        Login.removeAuthToken()

        Help.loggedOut()


      when "deploy"
        updater = new Updater
        updater.check
          from: "deploy"

        Help.logo()

        unless Login.authTokenExists()
          util.log "ERROR: no authentication found, run steroids login first."
          process.exit 1

        unless Login.authTokenExists()
          util.log "ERROR: Cancelling cloud build due to login failure"
          process.exit 1

        util.log "Building application locally"

        project = new Project
        project.make
          onSuccess: =>
            project.package
              onSuccess: =>
                Deploy = require "./steroids/Deploy"
                deploy = new Deploy(otherOptions)
                deploy.uploadToCloud ()=>
                  # all complete
                  process.exit 0
              onFailure: =>
                console.log "Cannot create package, cloud deploy not possible."
          onFailure: =>
            console.log "Cannot build project locally, cloud deploy not possible."

      when "chat"
        console.log "Chat is deprecated, please visit forums at http://forums.appgyver.com"

      when "safari"
        safariDebug = new SafariDebug
        if otherOptions[0]
          safariDebug.open(otherOptions[0])
        else
          Help.safariListingHeader()
          safariDebug.listViews()

      else
        Help.logo() unless argv.noLogo
        Help.usage()


module.exports =
  run: ->
    global.steroidsCli = new Steroids
      debug: argv.debug
      argv: argv

    steroidsCli.execute()

  Help: Help
  paths: paths
